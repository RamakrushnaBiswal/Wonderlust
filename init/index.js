const mongoose=require('mongoose')
const initdata = require('./data')
const Listing = require('../models/listing.js')

const MOONGO_URL= 'mongodb+srv://bunty:upbwDv.T4ST5g$j@wonderlust.yhocrhv.mongodb.net/?retryWrites=true&w=majority&appName=Wonderlust'
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
    initdata.data=initdata.data.map((obj)=>( {...obj,owner:"65f7a40e739e39a014520ec2"}))
    await Listing.insertMany(initdata.data)
    console.log('data inserted')
}
initDB()