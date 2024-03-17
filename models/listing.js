const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js')
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image:{
        type:String,
        default : "https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        set : (v) =>v === "" ? " https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1":v
    },
    price: Number,
    location: String,
    country:String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

listingSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

const listing= mongoose.model('listing', listingSchema);
module.exports = listing