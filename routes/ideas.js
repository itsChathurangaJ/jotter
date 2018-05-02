const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const Idea = mongoose.model('idea');

//Idea Index Route
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(idea => {
            res.render('ideas/index', {
                idea: idea
            })
        })
})

//Add Ideas route
router.get('/add', (req, res) => {
    res.render('ideas/add')
});

//Edit Ideas route
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg','Added!');
                res.redirect('/ideas');
            });
    }
});



//Process Edit Ideas form
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg','Removed!');
            res.redirect('/ideas');
        });
});

module.exports = router;