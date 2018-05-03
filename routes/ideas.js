const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');

//Ensure Authenticated helper
const {ensureAuthenticated} = require('../helpers/auth')

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('idea');

//Idea Index Route
router.get('/',ensureAuthenticated, (req, res) => {
    Idea.find({user:req.user.id})
        .sort({ date: 'desc' })
        .then(idea => {
            res.render('ideas/index', {
                idea: idea
            })
        })
})

//Add Ideas route
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
});

//Edit Ideas route
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            })
        })

});

//Process add Ideas form
router.post('/',ensureAuthenticated, (req, res) => {
    // console.log(req.body)
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Title not added!' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Details not added!' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });

    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg','Added!');
                res.redirect('/ideas');
            });
    }
});



//Process Edit Ideas form
router.put('/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title,
            idea.details = req.body.details

            idea.save()
                .then(idea => {
                    req.flash('success_msg','Updated!');
                    res.redirect('/ideas')
                })
        })

})
//Delete Idea
router.delete('/:id',ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg','Removed!');
            res.redirect('/ideas');
        });
});

module.exports = router;