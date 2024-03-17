const Listing=require('./models/listing.js')
const Review=require('./models/reviews.js')
const expressError = require('./utils/ExpressError.js')
const { listingSchema,reviewSchema } = require('./schema.js')


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log('req.user...',req.path)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash('error','you must be signed in')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        if (!listing.owner || !listing.owner.equals(res.locals.currentUser._id)) {
            req.flash('error', 'You do not have permission to edit');
            return res.redirect(`/listings/${id}`);
        }
        next();
};
module.exports.isReviewOuther = async (req, res, next) => {
        let {reviewId,id} = req.params;
        let review = await Review.findById(reviewId);
        if (!review.author.equals(res.locals.currentUser._id)) {
            req.flash('error', 'You do not have permission to edit');
            return res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} =listingSchema.validate(req.body)
        if(error){
            let errMsg=error.details.map(el => el.message).join(',')
            throw new expressError(errMsg, 400)
        }else{
            next()
        }
}

module.exports.validateReview = (req, res, next) => {
    let {error} =reviewSchema.validate(req.body)
        if(error){
            let errMsg=error.details.map(el => el.message).join(',')
            throw new expressError(errMsg, 400)
        }else{
            next()
        }
}