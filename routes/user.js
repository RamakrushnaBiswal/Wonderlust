const express = require('express');
const router= express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/signup', wrapAsync(async (req, res) => {
    let {username, email, password} = req.body;
    const newUser = new User({username, email})
    const registeredUser = await User.register(newUser, password)
    console.log(registeredUser)
    req.flash('success', 'Welcome to Wonderlust')
    res.redirect('/listings')
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async(req, res) => {
    req.flash('success', 'welcome back to Wonderlust :)')
    res.redirect('/listings')
})


module.exports = router;