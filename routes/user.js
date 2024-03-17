const express = require('express');
const router= express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/signup', wrapAsync(async (req, res) => {
    let {username, email, password} = req.body;
    const newUser = new User({username, email})
    const registeredUser = await User.register(newUser, password)
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err)
        }
        req.flash('success', 'Welcome to Wonderlust :)')
        res.redirect('/listings')
    })
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true, 
    failureRedirect: '/login'
}), async (req, res) => {
    req.flash('success', 'Welcome back to Wonderlust :)');
    const redirectUrl = res.locals.redirectUrl || '/listings'; 
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res,next) => {
    req.logout((err)=>{//inbuild logout method
        if(err){
            return next(err)
        }
        req.flash('success', 'you are logged out!')
        res.redirect('/listings')
    })
})

module.exports = router;