const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Load User Model
require('../models/User');
const User = mongoose.model('user');


//Register Route
router.get('/register', (req, res) => {
    if (!req.user) {
        res.render('users/register')
    }
    else {
        req.flash('success_msg', 'You are already registered!');
        res.redirect('/ideas');
    }
});

//Login Route
router.get('/login', (req, res) => {
    if (!req.user) {
        res.render('users/login');
    }
    else {
        req.flash('success_msg', 'You are already logged in!');
        res.redirect('/ideas');
    }

});

//Register form POST
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }
    if (req.body.password.length < 5) {
        errors.push({ text: 'Password must be atleast 5 characters long' })
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }
    else {
        User.findOne({ email: req.body.email })
            //Check if a user already exists
            .then(user => {
                if (user) {
                    req.flash('error_msg','User already exists!');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered!');
                                    res.redirect('/users/login')
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });
                }
            });
    }
});

//Login form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout successful!');
    res.redirect('/users/login');
})


module.exports = router;