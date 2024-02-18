const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const port = 3000
const Listing = require('./models/listing.js')

const MOONGODB_URL = 'mongodb://localhost:27017/wonderlust'

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


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

app.get('/', (req, res) => {
    res.send('Hello World!')
})
//index route
app.get('/listings', async(req, res) => {
    let alllistings = await Listing.find({})
    res.render('listings/index',{alllistings})
})
//add route
app.get('/listings/new', (req, res) => {
    res.render('listings/new')
})
//create route
app.post('/listings', async(req, res) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect('/listings')
})
//update route
app.put('/listings/:id', async(req, res) => {
    let id = req.params.id
    const updatedListing = req.body.listing
    await Listing.findByIdAndUpdate(id, updatedListing)
    res.redirect(`/listings/${id}`)
})
//edit route
app.get('/listings/:id/edit', async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    res.render('listings/edit', {listing})
})
//show route
app.get('/listings/:id', async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    res.render('listings/show', {listing})
})
//delete route
app.delete('/listings/:id', async(req, res) => {
    let id = req.params.id
    let delteData=await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})