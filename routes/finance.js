const express = require('express');
const Transaction = require('../models/Transaction');
const Bill = require('../models/Bill');
const auth = require('../middleware/auth');

const router = express.Router();

// Fetch financial overview
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch transactions
    let transactions = await Transaction.find({ userId });
    console.log('Fetched Transactions:', transactions);

    // Ensure transactions is an array
    if (!Array.isArray(transactions)) {
      console.error('Transactions is not an array');
      transactions = [];
    }

    // Sort transactions by date in descending order
    transactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    // Fetch bills
    let bills = await Bill.find({ userId, dueDate: { $gte: new Date() } });
    console.log('Fetched Bills:', bills);

    // Ensure bills is an array
    if (!Array.isArray(bills)) {
      console.error('Bills is not an array');
      bills = [];
    }

    // Sort bills by due date in ascending order
    bills = bills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const totalBalance = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    res.json({
      totalBalance,
      recentTransactions: transactions,
      upcomingBills: bills
    });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
