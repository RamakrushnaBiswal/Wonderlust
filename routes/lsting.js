const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../models/listing.js')
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js')


//index rout
router.get('/', wrapAsync(async(req, res) => {
    let alllistings = await Listing.find({})
    res.render('listings/index',{alllistings})
}))
//add route
router.get('/new',isLoggedIn, (req, res) => {  
    res.render('listings/new')
})
//create route
router.post('/', validateListing,wrapAsync(async(req, res, next) => {    
        const newListing = new Listing(req.body.listing)
        newListing.owner = req.user._id
        await newListing.save()
        req.flash('success', 'New listing created!')//for flash message when create a new listing
        res.redirect('/listings')
}))
//update route
router.put('/:id',validateListing,isLoggedIn,isOwner, wrapAsync(async(req, res) => {
    let id = req.params.id
    const updatedListing = req.body.listing
    await Listing.findByIdAndUpdate(id, updatedListing)
    res.redirect(`/listings/${id}`)
}))
//edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash('error', 'Listing not found! or it may be deleted!')
        return res.redirect('/listings')
    }
    res.render('listings/edit', {listing})
}))
//show route
router.get('/:id',wrapAsync( async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('owner')
    if(!listing){
        req.flash('error', 'Listing not found! or it may be deleted!')
        return res.redirect('/listings')
    }
    res.render('listings/show', {listing})
}))
//delete route
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(async(req, res) => {
    let id = req.params.id
    let delteData=await Listing.findByIdAndDelete(id)
    req.flash('success', 'Listing deleted!')
    res.redirect('/listings')
    console.log(delteData)
}))

module.exports = router