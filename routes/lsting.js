const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js')
const listingRouter= require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(listingRouter.index))
    .post(upload.single('listing[image]'),validateListing,wrapAsync(listingRouter.createListing))

    
router.get('/new',isLoggedIn,listingRouter.renderNewForm)


router.route('/:id')
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingRouter.updateListing))
    .get(wrapAsync(listingRouter.showListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingRouter.deleteListing))

router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingRouter.editListing))


module.exports = router