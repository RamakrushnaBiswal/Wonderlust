const mongoose=require('mongoose')
const initdata = require('./data')
const Listing = require('../models/listing.js')

const MOONGO_URL= 'mongodb://localhost:27017/wonderlust'
async function main() {
    await mongoose.connect(MOONGO_URL)
}
main()
    .then(() => {
        console.log('database connected') 
    })
    .catch((err) => {
        console.log(err)
    })

const initDB= async()=>{
    await Listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>( {...obj,owner:"65f28c74cac1613abac2ef4a"}))
    await Listing.insertMany(initdata.data)
    console.log('data inserted')
}
initDB()