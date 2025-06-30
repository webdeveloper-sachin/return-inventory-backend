const ConfirmOrder = require("../models/confirmOrder.modal");
const ShippedOrders = require("../models/shopifyShippedOrder.modal");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Get confirm orders
const getConfirmOrders = async (_, res, next) => {
  try {
    const confirmOrders = await ConfirmOrder.find();
    res.status(200).json(new ApiResponse(200, confirmOrders.length === 0 ? "No confirm records found" : "Confirm orders fetched successfully", confirmOrders));
  } catch (error) {
    next(error);
  }
};

// Move confirm order to shipped
const addToShip = async (req, res, next) => {
  try {
    const {
      order_id, styleNumber, size, quantity,
      order_date, shipping_method, order_status,
      contact_number, payment_status
    } = req.body;

    // Check for missing fields
    const requiredFields = [order_id, styleNumber, size, quantity, order_date, shipping_method, order_status, contact_number, payment_status];
    if (requiredFields.some((field) => !field)) {
      return next(new ApiError(400, "All fields are required"));
    }

    // // Find the confirm order
    // const findOrderFromConfirmOrders = await ConfirmOrder.findOne({ order_id });
    // if (!findOrderFromConfirmOrders) {
    //   return next(new ApiError(404, `${order_id} not found in confirm orders.`));
    // }

    // Insert into shipped orders
    const insertedShippedOrder = await ShippedOrders.create({
      order_id, order_date, styleNumber, size, quantity,
      shipping_method, order_status, contact_number, payment_status
    });

    // Remove from confirm orders
    await ConfirmOrder.findByIdAndDelete(findOrderFromConfirmOrders._id);

    res.status(201).json(new ApiResponse(201, `${order_id} shipped successfully`, insertedShippedOrder));
  } catch (error) {
    next(error);
  }
};

// Get all shipped orders
const getShippedOrders = async (req, res, next) => {
  try {
    const shippedOrders = await ShippedOrders.find();
    res.status(200).json(new ApiResponse(200, shippedOrders.length === 0 ? "No shipped records found" : "Shipped orders fetched successfully", shippedOrders));
  } catch (error) {
    next(error);
  }
};

module.exports = { getConfirmOrders, addToShip, getShippedOrders };
