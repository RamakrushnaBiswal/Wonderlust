const express = require('express')
const router = express.Router({mergeParams: true})//for merge Params
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../models/listing.js')
const Reviews = require('../models/reviews.js')
const {validateReview,isLoggedIn,isReviewOuther} = require('../middleware.js')
//validate review


//reviews route[post]
router.post('/',validateReview,isLoggedIn, wrapAsync(async(req, res) => {
    let id = req.params.id
    let listing=await Listing.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    req.flash('success', 'New Review created!')
    await listing.save()
    res.redirect(`/listings/${id}`)
}))

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewOuther, wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted!')
    res.redirect(`/listings/${id}`)
}))

module.exports = router