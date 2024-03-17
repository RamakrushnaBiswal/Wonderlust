const Reviews = require('../models/reviews.js')
const Listing = require('../models/listing.js')

module.exports.createReview=async(req, res) => {
    let id = req.params.id
    let listing=await Listing.findById(req.params.id)
    let newReview = new Reviews(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    req.flash('success', 'New Review created!')
    await listing.save()
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview=async(req, res) => {
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted!')
    res.redirect(`/listings/${id}`)
}