const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/insights', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT type, SUM(amount) as total, COUNT(*) as count
       FROM transactions t
       JOIN accounts a ON (a.id = t.sender_account_id OR a.id = t.receiver_account_id)
       WHERE a.user_id = $1
       GROUP BY type`,
      [req.user.id]
    );

    const stats = result.rows;
    const totalIn = stats.find(s => s.type === 'deposit')?.total || 0;
    const totalOut = stats.filter(s => s.type !== 'deposit').reduce((s, r) => s + Number(r.total), 0);
    const flaggedRes = await pool.query(
      `SELECT COUNT(*) FROM transactions t
       JOIN accounts a ON (a.id = t.sender_account_id OR a.id = t.receiver_account_id)
       WHERE a.user_id = $1 AND t.flagged = true`,
      [req.user.id]
    );

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a personal banking assistant. Write a 3-sentence financial insight for this user. Be specific with numbers, friendly, and actionable. Speak directly to the user.

Their data:
- Total money in: ₹${Number(totalIn).toLocaleString('en-IN')}
- Total money out: ₹${Number(totalOut).toLocaleString('en-IN')}
- Net flow: ₹${(Number(totalIn) - totalOut).toLocaleString('en-IN')}
- Flagged transactions: ${flaggedRes.rows[0].count}

Write the insight now:`;

    const aiResult = await model.generateContent(prompt);
    res.json({ insight: aiResult.response.text().trim(), stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not generate insight' });
  }
});

module.exports = router;