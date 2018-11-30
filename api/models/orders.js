const mongoose=require("mongoose")
var Schema= mongoose.Schema;
const orderSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name:String,
   product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
   quantity:{type:Number,require:true,default:1}
})

module.exports =mongoose.model('Order',orderSchema)