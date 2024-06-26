const Listing = require('../models/listing.js')

module.exports.index=async(req, res) => {
    let alllistings = await Listing.find({})
    res.render('listings/index',{alllistings})
}

module.exports.renderNewForm=async(req, res) => {
    res.render('listings/new')
}

module.exports.createListing=async(req, res, next) => {   
    let url=req.file.path
    let filename=req.file.filename

    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image={url,filename}
    await newListing.save()
    req.flash('success', 'New listing created!')//for flash message when create a new listing
    res.redirect('/listings')
}

module.exports.updateListing=async(req, res) => {
    
    let id = req.params.id
    const updatedListing = req.body.listing
    let listing=await Listing.findByIdAndUpdate(id, updatedListing)

    if(typeof req.file !== 'undefined'){
    let url=req.file.path
    let filename=req.file.filename
    listing.image={url,filename}
    await listing.save()
    }
    res.redirect(`/listings/${id}`)
}

module.exports.editListing=async(req, res) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash('error', 'Listing not found! or it may be deleted!')
        return res.redirect('/listings')
    }
    res.render('listings/edit', {listing})
}

module.exports.showListing=async(req, res) => {
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
}

module.exports.deleteListing=async(req, res) => {
    let id = req.params.id
    let delteData=await Listing.findByIdAndDelete(id)
    req.flash('success', 'Listing deleted!')
    res.redirect('/listings')
    console.log(delteData)
}