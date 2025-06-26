const mongoose = require("mongoose");

const confirmOrderSchema = new mongoose.Schema({
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

const ConfirmOrder = mongoose.model("ConfirmOrder",confirmOrderSchema);

module.exports = ConfirmOrder;