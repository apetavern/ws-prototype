const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/logout', (req, res, next) => {
    res.redirect('/');
});

router.get('/steam', passport.authenticate('steam', { failureRedirect: '/'}), (req, res, next) => {
    res.redirect('/');
});

router.get('/steam/callback', passport.authenticate('steam'), (req, res, next) => {
    res.redirect('/');
})

module.exports = router;