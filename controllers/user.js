const User = require('../models/user.js');

module.exports.signup=(req, res) => {
    res.render('users/signup')
}
module.exports.signupForm=async (req, res) => {
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
}
module.exports.login=(req, res) => {
    res.render('users/login')
}

module.exports.loginForm=async (req, res) => {
    req.flash('success', 'Welcome back to Wonderlust :)');
    const redirectUrl = res.locals.redirectUrl || '/listings'; 
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res,next) => {
    req.logout((err)=>{//inbuild logout method
        if(err){
            return next(err)
        }
        req.flash('success', 'you are logged out!')
        res.redirect('/listings')
    })
}