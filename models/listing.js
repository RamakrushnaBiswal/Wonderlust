const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    country:String
});
const listing= mongoose.model('listing', listingSchema);
module.exports = listing