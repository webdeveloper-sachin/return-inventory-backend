const mongoose = require("mongoose");

const shippedOrders = new mongoose.Schema({
    order_id:{
        type:String,
        required:true
    },
    styleNumber:{
        type:Number,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    order_date :{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    }
},{timestamps:true});

const ShippedOrers = mongoose.model("ShippedOrder",shippedOrders);

module.exports = ShippedOrers;