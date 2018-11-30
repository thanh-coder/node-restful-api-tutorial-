const mongoose=require("mongoose")
var Schema= mongoose.Schema;
const productSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name:String,
    price:Number
})

module.exports =mongoose.model('Product',productSchema)