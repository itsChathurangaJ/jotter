const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const Idea = mongoose.model('idea');

//Login Route
router.get('/login',(req,res)=>{
    res.render('users/login')
});


//Register Route
router.get('/register',(req,res)=>{
    res.render('users/register')
});

module.exports = router;