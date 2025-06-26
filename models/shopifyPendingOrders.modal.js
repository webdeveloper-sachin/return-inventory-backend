const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
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
  }
}, { timestamps: true });

const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);

module.exports = PendingOrder;
