const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Helper: generate a random 14-digit account number with SB prefix
function generateAccountNumber() {
  const digits = Math.floor(10000000000000 + Math.random() * 89999999999999);
  return `SB${digits}`;
}

// GET all accounts for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch accounts' });
  }
});

// POST create a new account (savings or current)
router.post('/', auth, async (req, res) => {
  try {
    const { account_type } = req.body;

    if (!['savings', 'current'].includes(account_type)) {
      return res.status(400).json({ message: 'Account type must be savings or current' });
    }

    const accountNumber = generateAccountNumber();

    const result = await pool.query(
      `INSERT INTO accounts (user_id, account_number, account_type, balance)
       VALUES ($1, $2, $3, 0.00) RETURNING *`,
      [req.user.id, accountNumber, account_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create account' });
  }
});

module.exports = router;