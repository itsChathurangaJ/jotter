const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

//Inititalize 
const app = express();

//Map global promise
mongoose.Promise = global.Promise;


//Connect to mongoose
mongoose.connect('mongodb://localhost/jotter')
    .then(() => console.log(`Mongo DB Connected`))
    .catch(err => console.log(err));



//express-handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//express-session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash Middleware
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user||null;
    next();
})

//method-override Middleware
app.use(methodOverride('_method'));

//Load Routes
const index = require('./routes/index');
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Use routes
app.use('/',index);
app.use('/ideas',ideas);
app.use('/users',users);

//Passport Config
require('./config/passport')(passport);

//Set Port
const port = 5000;

//Listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})