const express = require('express');
const Transaction = require('../models/Transaction');
const Bill = require('../models/Bill');
const auth = require('../middleware/auth');

const router = express.Router();

//Fetch financial overview
router.get('/overview', auth, async (req, res) =>{
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({userId}).sort({date: -1}).limit(10);
        const bills = await Bill.find({userId, dueDate:{ $gte: new Date()}}.sort({dueDate: 1}));

        const totalBalance = transactions.reduce((acc, transaction)=>{
            return transaction.type==="income" ? acc+transaction.amount: acc- transaction.amount;

        },0 );

        res.json({
            totalBalance,
            recentTransactions: transactions,
            upcomingBills: bills
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;