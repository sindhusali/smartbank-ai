const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { explainFraud } = require('../services/aiExplainer');


// GET recent transactions for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await pool.query(
      `SELECT 
        t.*,
        sa.account_number AS sender_account_number,
        sa.account_type   AS sender_account_type,
        ra.account_number AS receiver_account_number,
        ra.account_type   AS receiver_account_type,
        su.name           AS sender_name,
        ru.name           AS receiver_name
       FROM transactions t
       LEFT JOIN accounts sa ON sa.id = t.sender_account_id
       LEFT JOIN accounts ra ON ra.id = t.receiver_account_id
       LEFT JOIN users su    ON su.id = sa.user_id
       LEFT JOIN users ru    ON ru.id = ra.user_id
       WHERE sa.user_id = $1 OR ra.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2`,
      [req.user.id, limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch transactions' });
  }
});

// POST deposit money into an account
router.post('/deposit', auth, async (req, res) => {
  try {
    const { account_id, amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount' });
    }
    const acc = await pool.query(
      'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
      [account_id, req.user.id]
    );
    if (acc.rows.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    await pool.query('BEGIN');
    await pool.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, account_id]
    );
    const txn = await pool.query(
      `INSERT INTO transactions (receiver_account_id, amount, type, status)
       VALUES ($1, $2, 'deposit', 'completed') RETURNING *`,
      [account_id, amount]
    );
    await pool.query('COMMIT');
    res.status(201).json(txn.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Deposit failed' });
  }
});

// POST transfer money between accounts
router.post('/transfer', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { from_account_id, to_account_number, amount, note } = req.body;

    if (!from_account_id || !to_account_number || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Missing or invalid transfer details' });
    }

    const senderRes = await client.query(
      'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
      [from_account_id, req.user.id]
    );
    if (senderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Sender account not found' });
    }
    const sender = senderRes.rows[0];

    if (sender.is_frozen) {
      return res.status(403).json({ message: 'This account is frozen and cannot send transfers' });
    }
    if (Number(sender.balance) < Number(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receiverRes = await client.query(
      'SELECT * FROM accounts WHERE account_number = $1',
      [to_account_number]
    );
    if (receiverRes.rows.length === 0) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }
    const receiver = receiverRes.rows[0];

    if (receiver.id === sender.id) {
      return res.status(400).json({ message: 'Cannot transfer to the same account' });
    }
// Call ML service for fraud prediction
let riskScore = 0.05;
let reasons = [];

try {
  // Get prior transfer count to this recipient
  const priorRes = await client.query(
    `SELECT COUNT(*) FROM transactions
     WHERE sender_account_id = $1 AND receiver_account_id = $2`,
    [sender.id, receiver.id]
  );
  const isNewRecipient = Number(priorRes.rows[0].count) === 0;

  // Get recent transfer count in last hour
  const recentRes = await client.query(
    `SELECT COUNT(*) FROM transactions
     WHERE sender_account_id = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
    [sender.id]
  );
  const recentCount = Number(recentRes.rows[0].count);

  // Get average transfer amount
  const avgRes = await client.query(
    `SELECT AVG(amount) as avg_amount FROM transactions
     WHERE sender_account_id = $1 AND type = 'transfer'`,
    [sender.id]
  );
  const avgAmount = Number(avgRes.rows[0].avg_amount) || 0;

  // Call ML microservice
  const mlResponse = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Number(amount),
      hour_of_day: new Date().getHours(),
      is_new_recipient: isNewRecipient,
      recent_transfer_count: recentCount,
      avg_transfer_amount: avgAmount,
    }),
  });

  if (mlResponse.ok) {
    const mlData = await mlResponse.json();
    riskScore = mlData.risk_score;
    reasons = mlData.reasons;
    console.log(`ML prediction: score=${riskScore}, flagged=${mlData.flagged}`);
  } else {
    throw new Error('ML service returned error');
  }
} catch (mlError) {
  console.error('ML service error — falling back to rules:', mlError.message);
  // Fallback to rule-based scoring if ML service is down
  if (Number(amount) > 100000) { riskScore += 0.25; reasons.push('transfer exceeds Rs 1,00,000'); }
  riskScore = Math.min(riskScore, 0.97);
}

const flagged = Math.round(riskScore * 100) >= 45;
    await client.query('BEGIN');

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, sender.id]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, receiver.id]
    );

    const txnRes = await client.query(
      `INSERT INTO transactions
       (sender_account_id, receiver_account_id, amount, type, status, fraud_score, flagged, note)
       VALUES ($1, $2, $3, 'transfer', 'completed', $4, $5, $6)
       RETURNING *`,
      [sender.id, receiver.id, amount, riskScore, flagged, note || null]
    );
    const transaction = txnRes.rows[0];

    let aiExplanation = null;

    if (flagged) {
  console.log('🚨 Transfer flagged! Calling Gemini...');
  console.log('Risk score:', riskScore, 'Reasons:', reasons);
  
  aiExplanation = await explainFraud({
    amount,
    riskScore,
    reasons,
    receiverName: receiver.account_number,
  });
  
  console.log('✅ Gemini response:', aiExplanation);


      await client.query(
        `INSERT INTO fraud_flags (transaction_id, risk_score, reasons, ai_explanation)
         VALUES ($1, $2, $3, $4)`,
        [transaction.id, riskScore, reasons, aiExplanation]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      transaction,
      flagged,
      risk_score: riskScore,
      reasons,
      ai_explanation: aiExplanation,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Transfer failed. Please try again.' });
  } finally {
    client.release();
  }
});

module.exports = router;