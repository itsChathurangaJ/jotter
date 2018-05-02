const express = require('express');
const router = express.Router();

//Index Route
router.get('/', (req, res) => {
    res.render('index/home')
});

//About Route
router.get('/about', (req, res) => {
    res.render('index/about')
});

module.exports = router;