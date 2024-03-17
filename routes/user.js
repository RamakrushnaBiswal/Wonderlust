const express = require('express');
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js')

router.route('/signup')
    .get(userController.signup )
    .post(wrapAsync(userController.signupForm))

router.route('/login')
    .get(userController.login)
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureFlash: true, 
        failureRedirect: '/login'
    }),userController.loginForm );


router.get('/logout',  userController.logout)

module.exports = router;