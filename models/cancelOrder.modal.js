const mongoose = require("mongoose");

const cancelOrderSchema = new mongoose.Schema({
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

const CancelOrder = mongoose.model("CancelOrder",cancelOrderSchema);

module.exports = CancelOrder;