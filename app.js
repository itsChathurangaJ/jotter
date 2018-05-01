const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//Inititalize 
const app = express();

//Map global promise
mongoose.Promise = global.Promise;


//Connect to mongoose
mongoose.connect('mongodb://localhost/jotter')
    .then(() => console.log(`Mongo DB Connected`))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('idea')


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//express-handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//method-override Middleware
app.use(methodOverride('_method'))

//Index Route
app.get('/', (req, res) => {
    res.render('index')
});

//About Route
app.get('/about', (req, res) => {
    res.render('about')
});

//Idea Index Route
app.get('/ideas',(req,res)=>{
    Idea.find({})
        .sort({date:'desc'})
        .then(idea=>{
            res.render('ideas/index',{
                idea:idea
            })
        })   
})

//Add Ideas route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
});

//Edit Ideas route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit',{
            idea:idea
        })
    })
    
});

//Process add Ideas form
app.post('/ideas', (req, res) => {
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
            .then(idea => res.redirect('/ideas'));
    }
});



//Process Edit Ideas form
app.put('/ideas/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        //new values
        idea.title=req.body.title,
        idea.details=req.body.details

        idea.save()
            .then(idea=>{
                res.redirect('/ideas')
            })
    })
    
})
//Delete Idea
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({_id:req.params.id})
        .then(()=>{
            res.redirect('/ideas')
        });
});






//Set Port
const port = 5000;

//Listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})