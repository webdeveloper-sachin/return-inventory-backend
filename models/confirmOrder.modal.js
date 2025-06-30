
const mongoose = require("mongoose");

const confirmOrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,

  },
  styleNumber: { // ✅ fixed typo here
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  order_date: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  shipping_method:{
    type:String,
  },
  order_status:{
    type:String,
    required:true,
  },
  contact_number:{
    type:String,
  },
  payment_status:{
    type:String,
  }

}, { timestamps: true });



const ConfirmOrder = mongoose.model("ConfirmOrder",confirmOrderSchema);

module.exports = ConfirmOrder;