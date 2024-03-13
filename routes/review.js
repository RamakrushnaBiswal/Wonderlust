const express = require('express')
const router = express.Router({mergeParams: true})//for merge Params
const wrapAsync = require('../utils/wrapAsync.js')
const expressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing.js')
const Reviews = require('../models/reviews.js')
const { reviewSchema } = require('../schema.js')

//validate review
const validateReview = (req, res, next) => {
    let {error} =reviewSchema.validate(req.body)
        if(error){
            let errMsg=error.details.map(el => el.message).join(',')
            throw new expressError(errMsg, 400)
        }else{
            next()
        }
}

//reviews route[post]
router.post('/',validateReview, wrapAsync(async(req, res) => {
    let id = req.params.id
    let listing=await Listing.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    req.flash('success', 'New Review created!')
    await listing.save()
    res.redirect(`/listings/${id}`)
}))

//delete review route
router.delete('/:reviewId', wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted!')
    res.redirect(`/listings/${id}`)
}))

module.exports = router