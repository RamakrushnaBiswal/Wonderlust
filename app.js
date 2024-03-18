if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')

const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const port = 3000
const expressError = require('./utils/ExpressError.js') 
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const listingRouter= require('./routes/lsting.js')
const reviewRouter= require('./routes/review.js')
const userRouter= require('./routes/user.js')

const dbURL = process.env.ATLAS_DB_URL

async function main() {
    await mongoose.connect(dbURL)
}
main()
    .then(() => {
        console.log('database connected')
    })
    .catch((err) => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true,}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

const store=MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    },
    client: process.env.ATLAS_DB_URL
})

store.on('error', (e)=>{
    console.log('session store error', e)
})

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// 1 week from now
        maxAge: 1000 * 60 * 60 * 24 * 74,
        httpOnly: true //for avoid website hacking
    }
}



app.use(session(sessionConfig))
app.use(flash()) //for flash message    

//passport middleware
app.use(passport.initialize()) //initialize passport
app.use(passport.session()) //use session for passport
passport.use(new LocalStrategy(User.authenticate())) //use local strategy for passport and authenticate method is provided by passport-local-mongoose

passport.serializeUser(User.serializeUser()) //serialize user means store user in session
passport.deserializeUser(User.deserializeUser()) //deserialize user means get out user from session



app.use(async (req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})



app.use('/listings', listingRouter)
app.use('/listings/:id/reviews',  reviewRouter)
app.use('/', userRouter)


app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

app.use((err,req, res, next) => {
    let {statusCode=500 ,message='Something went wrong'} = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render('listings/error', {message})
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})