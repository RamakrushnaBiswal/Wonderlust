const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const port = 3000
const Listing = require('./models/listing.js')
const Reviews = require('./models/reviews.js')
const  wrapAsync  = require('./utils/wrapAsync.js')
const expressError = require('./utils/ExpressError.js')
const { listingSchema,reviewSchema } = require('./schema.js')


const MOONGODB_URL = 'mongodb://localhost:27017/wonderlust'

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))


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
    
const validateListing = (req, res, next) => {
    let {error} =listingSchema.validate(req.body)
        if(error){
            let errMsg=error.details.map(el => el.message).join(',')
            throw new expressError(errMsg, 400)
        }else{
            next()
        }
}
const validateReview = (req, res, next) => {
    let {error} =reviewSchema.validate(req.body)
        if(error){
            let errMsg=error.details.map(el => el.message).join(',')
            throw new expressError(errMsg, 400)
        }else{
            next()
        }
}

//index route
app.get('/listings', wrapAsync(async(req, res) => {
    let alllistings = await Listing.find({})
    res.render('listings/index',{alllistings})
}))
//add route
app.get('/listings/new', (req, res) => {
    res.render('listings/new')
})
//create route
app.post('/listings', validateListing,wrapAsync(async(req, res, next) => {    
        const newListing = new Listing(req.body.listing)
        await newListing.save()
        res.redirect('/listings')
}))
//update route
app.put('/listings/:id',validateListing, wrapAsync(async(req, res) => {
    let id = req.params.id
    const updatedListing = req.body.listing
    await Listing.findByIdAndUpdate(id, updatedListing)
    res.redirect(`/listings/${id}`)
}))
//edit route
app.get('/listings/:id/edit', wrapAsync(async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    res.render('listings/edit', {listing})
}))
//show route
app.get('/listings/:id',wrapAsync( async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id).populate('reviews')
    res.render('listings/show', {listing})
}))
//delete route
app.delete('/listings/:id', wrapAsync(async(req, res) => {
    let id = req.params.id
    let delteData=await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
    console.log(delteData)
}))

//reviews route[post]
app.post('/listings/:id/reviews',validateReview, wrapAsync(async(req, res) => {
    let id = req.params.id
    let listing=await Listing.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    console.log(newReview)
    res.redirect(`/listings/${id}`)
}))

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