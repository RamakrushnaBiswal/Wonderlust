const express = require('express')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const port = 3000
const listingRoute= require('./routes/lsting.js')
const reviewRoute= require('./routes/review.js')
const expressError = require('./utils/ExpressError.js') 
const session = require('express-session')


const MOONGODB_URL = 'mongodb://localhost:27017/wonderlust'

async function main() {
    await mongoose.connect(MOONGODB_URL)
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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))


const sessionConfig = {
    secret: 'my secret id!',
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

app.use(async (req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/listings', listingRoute)
app.use('/listings/:id/reviews',  reviewRoute)


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