const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: String
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;