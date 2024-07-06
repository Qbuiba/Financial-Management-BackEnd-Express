//Define the authentication routes
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


// Helper function to validate username
const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9]{3,15}$/;
  return regex.test(username);
};

//Register route
router.post('/register', async (req, res) =>{
    const {username, password} = req.body;

    if (!validateUsername(username)) {
        return res.status(400).json({ message: 'Username must be 3-15 characters long and contain no special characters.' });
    }
    
      if (password.length < 6 || password.length > 8) {
        return res.status(400).json({ message: 'Password must be between 6 and 8 characters.' });
    }

    try{
        //Check if user existed in database -> Error -> To pick other username
        let user = await User.findOne({username});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }
        
        //If it is new user -> Continue
        user = new User({username, password});
        await user.save();

        const payload = {user: {id:user.id}};

        jwt.sign(payload, 'your_jwt_secret', {expiresIn:'1h'}, (err, token)=>{
            if(err) throw err;
            console.log(`Register successful`)
            res.json({token});
        })
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//Login route
router.post('/login', async (req,res)=>{
    const {username,password} = req.body;

    try{
        //Check if find any user in database
        const user = await User.findOne({username});
        //If username not existed, return invalid
        if(!user){
            console.log('Login failed: Invalid credentials');
            return res.status(400).json({message: 'Invalid credentials'});
        }
        
        //Check password if matching or not
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            console.log('Login failed: Invalid credentials');
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const payload = {user: {id: user.id}};

        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            console.log('Login successful');
            res.json({ token });
          });

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports =  router;