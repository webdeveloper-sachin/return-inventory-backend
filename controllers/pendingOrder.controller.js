const PendingOrder = require("../models/shopifyPendingOrders.modal");
const ApiResponse = require("../utils/ApiResponse");
const ConfirmOrder = require("../models/confirmOrder.modal");
const CancelOrder = require("../models/cancelOrder.modal");
const ApiError = require("../utils/ApiError");


// get all pending orders 
const pendingOrders = async(_,res,next)=>{
    try {
    const pending_orders = await PendingOrder.find();
    if(pending_orders.length === 0){
        return res.status(200).json(new ApiResponse(200,"No orders found"));
    }
    res.status(200).json(new ApiResponse(200,"All orders fetched successfully.",pending_orders));
        
    } catch (error) {
        next(error)
    }
}


// add orders to pending orders list 
const addToPendingOrder = async (req, res, next) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return next(new ApiError(400, "No orders provided."));
    }

    // Optional: filter out orders with missing order_id or required fields
    const validOrders = orders.filter(order => order.order_id);
    if (validOrders.length === 0) {
      return next(new ApiError(400, "All orders are missing order_id."));
    }

    const insertedOrders = await PendingOrder.insertMany(validOrders, { ordered: false });

    res.status(201).json(new ApiResponse(
      201,
      `${insertedOrders.length} new order(s) added to pending list.`,
      insertedOrders
    ));
  } catch (error) {
    next(error);
  }
};

// add order to confirm order 
const addToConfirmOrders = async (req, res, next) => {
  try {
    const {
      order_id,
      styleNumber,
      size,
      quantity,
      order_date,
      shipping_method,
      order_status,
      contact_number,
      payment_status,
    } = req.body;

    // 1. Validate required fields
    if ([ order_id, styleNumber, size, quantity, order_date, shipping_method, order_status, contact_number, payment_status ].some((item) => !item)) {
      return next(new ApiError(400, "All fields are required."));
    }



    // 2. Insert into ConfirmOrder
    const confirmOrderInserted = await ConfirmOrder.create({
      order_id,
      styleNumber,
      size,
      quantity,
      order_date,
      shipping_method,
      order_status,
      contact_number,
      payment_status,
    });

    // 3. Remove from PendingOrder if exists
    await PendingOrder.findOneAndDelete({ order_id });

    // 4. Success response
    return res.status(201).json(
      new ApiResponse(
        201,
        `${confirmOrderInserted.order_id} added to confirm order.`,
        confirmOrderInserted
      )
    );
  } catch (error) {
    next(error);
  }
};

// add order to cancel order 

const addToCancelOrders = async (req, res, next) => {
  try {
    const {
      order_id,
      styleNumber,
      size,
      quantity,
      order_date,
      shipping_method,
      order_status,
      contact_number,
      payment_status,
    } = req.body;

    // 1. Validate required fields
    if ([ order_id, styleNumber, size, quantity, order_date, shipping_method, order_status, contact_number, payment_status ].some((item) => !item)) {
      return next(new ApiError(400, "All fields are required."));
    }



    // 2. Insert into ConfirmOrder
    const cancelOrderInserted = await CancelOrder.create({
      order_id,
      styleNumber,
      size,
      quantity,
      order_date,
      shipping_method,
      order_status,
      contact_number,
      payment_status,
    });

    // 3. Remove from PendingOrder if exists
    await PendingOrder.findOneAndDelete({ order_id });

    // 4. Success response
    return res.status(201).json(
      new ApiResponse(
        201,
        `${cancelOrderInserted.order_id} added to cancel order.`,
        cancelOrderInserted
      )
    );
  } catch (error) {
    next(error);
  }
};







module.exports = {addToPendingOrder , addToCancelOrders, addToConfirmOrders,pendingOrders};
