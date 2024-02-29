const joi= require('joi')
module.exports.listingSchema= joi.object({
     listing: joi.object({
        title: joi.string().required().pattern(new RegExp('^[A-Za-z]+$')),
        description: joi.string().required().pattern(new RegExp('^[A-Za-z]+$')),
        image: joi.string().allow('',null),
        price: joi.number().min(1).required(),
        location: joi.string().required().pattern(new RegExp('^[A-Za-z]+$')),
        country: joi.string().required().pattern(new RegExp('^[A-Za-z]+$'))
    }).required(),
})

module.exports.reviewSchema= joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().min(1).max(5).required()
    }).required()
})