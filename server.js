const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const financialRoutes = require('./routes/finance');
const auth = require('./middleware/auth');

const app = express();

//middleware
app.use(bodyParser.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financialRoutes);

//Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err));


//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));