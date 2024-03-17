const express = require('express')
const router = express.Router({mergeParams: true})//for merge Params
const wrapAsync = require('../utils/wrapAsync.js')
const {validateReview,isLoggedIn,isReviewOuther} = require('../middleware.js')
const reviewController= require('../controllers/review.js')
//reviews route[post]
router.post('/',validateReview,isLoggedIn, wrapAsync(reviewController.createReview))

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewOuther, wrapAsync(reviewController.destroyReview))

module.exports = router