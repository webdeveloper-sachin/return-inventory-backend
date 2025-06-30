const CancelOrder = require("../models/cancelOrder.modal");
const ShippedOrder = require("../models/shopifyShippedOrder.modal"); // <-- Add this
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Get all cancel orders
const getCancelOrders = async (_, res, next) => {
  try {
    const cancelOrders = await CancelOrder.find();
    if (cancelOrders.length === 0) {
      return res.status(200).json(new ApiResponse(200, "No cancel orders found", []));
    }
    res.status(200).json(new ApiResponse(200, "Cancel orders fetched successfully", cancelOrders));
  } catch (error) {
    next(error);
  }
};

// Delete and move cancel order
const deleteCancelOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return next(new ApiError(400, "order_id is required")); // <-- FIXED
    }

    const cancelOrder = await CancelOrder.findOne({ order_id });

    if (!cancelOrder) {
      return next(new ApiError(404, `${order_id} not found.`)); // <-- FIXED
    }

    // Add to shipped orders
    const plainCancelOrder = cancelOrder.toObject(); // <-- Convert to plain object
    delete plainCancelOrder._id; // <-- Remove _id to avoid duplication
    const addToShippedOrder = await ShippedOrder.create(plainCancelOrder);

    // Delete from cancel orders
    await CancelOrder.findByIdAndDelete(cancelOrder._id);

    res.status(201).json(new ApiResponse(201, `${order_id} moved to all orders.`, addToShippedOrder));
  } catch (error) {
    next(error);
  }
};

module.exports = { getCancelOrders, deleteCancelOrder };
