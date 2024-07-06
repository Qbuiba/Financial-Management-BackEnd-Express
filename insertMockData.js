const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Bill = require('./models/Bill');

// Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/mydatabase'; // Update this with your database name
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const insertMockData = async () => {
  try {
    // Create user "quyen"
    const username = 'quyen';
    const password = 'bui';
    let user = await User.findOne({ username });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({ username, password: hashedPassword });
      await user.save();
      console.log('User "quyen" created');
    } else {
      console.log('User "quyen" already exists');
    }

    // Get user ID
    const userId = user._id;

    // Insert mock transactions
    const transactions = [
      { userId, amount: 1500, type: 'income', date: new Date('2024-06-01'), description: 'Salary' },
      { userId, amount: 200, type: 'expense', date: new Date('2024-06-05'), description: 'Groceries' },
      { userId, amount: 50, type: 'expense', date: new Date('2024-06-10'), description: 'Utilities' },
      { userId, amount: 300, type: 'income', date: new Date('2024-06-15'), description: 'Freelance' },
      { userId, amount: 100, type: 'expense', date: new Date('2024-06-20'), description: 'Internet Bill' }
    ];
    await Transaction.insertMany(transactions);
    console.log('Mock transactions inserted');

    // Insert mock bills
    const bills = [
      { userId, amount: 100, dueDate: new Date('2024-07-05'), description: 'Credit Card Bill' },
      { userId, amount: 50, dueDate: new Date('2024-07-10'), description: 'Electricity Bill' },
      { userId, amount: 80, dueDate: new Date('2024-07-15'), description: 'Water Bill' }
    ];
    await Bill.insertMany(bills);
    console.log('Mock bills inserted');

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

insertMockData();
