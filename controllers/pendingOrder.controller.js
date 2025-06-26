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
      return res.status(400).json(new ApiResponse(400, "No orders provided."));
    }

    const orderIds = orders.map(order => order.order_id);

    // Find existing orders with those order_ids
    const existingOrders = await PendingOrder.find({ order_id: { $in: orderIds } });
    const existingOrderIds = new Set(existingOrders.map(order => order.order_id));

    // Filter out orders that already exist
    const newOrders = orders.filter(order => !existingOrderIds.has(order.order_id));

    if (newOrders.length === 0) {
      return res.status(200).json(new ApiResponse(200, "All orders already exist. No new orders added."));
    }

    const insertedOrders = await PendingOrder.insertMany(newOrders, { ordered: false });

    return res
      .status(201)
      .json(new ApiResponse(201, `${insertedOrders.length} new order(s) added.`, insertedOrders));
  } catch (error) {
    next(error);
  }


};

// add order to confirm order 
const addToConfirmOrders = async (req, res, next) => {
  try {
    const { order_id, styleNumber, size, order_date, quantity } = req.body;

    // 1. Validate required fields
    if ([order_id, styleNumber, size, order_date, quantity].some((item) => !item)) {
      return next(new ApiError(400, "All fields are required."));
    }

    // 2. Check for duplicate order_id
    const orderIdExists = await ConfirmOrder.findOne({ order_id });
    if (orderIdExists) {
      return next(
        new ApiError(400, "This order already exists in confirm order.", orderIdExists)
      );
    }

    // 3. Insert into ConfirmOrder
    const confirmOrderInserted = await ConfirmOrder.create({
      order_id,
      styleNumber,
      size,
      order_date,
      quantity,
    });

    // 4. Remove from PendingOrder if it exists
    const pendingOrder = await PendingOrder.findOne({ order_id });
    if (pendingOrder) {
      await PendingOrder.findByIdAndDelete(pendingOrder._id);
    }

    // 5. Success response
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          `${confirmOrderInserted.order_id} added to confirm order`,
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
    const { order_id, styleNumber, size, order_date, quantity } = req.body;

    // 1. Validate required fields
    if ([order_id, styleNumber, size, order_date, quantity].some((item) => !item)) {
      return next(new ApiError(400, "All fields are required."));
    }

    // 2. Check for duplicate order_id
    const orderIdExists = await CancelOrder.findOne({ order_id });
    if (orderIdExists) {
      return next(
        new ApiError(400, "This order already exists in cancel order.", orderIdExists)
      );
    }

    // 3. Insert into ConfirmOrder
    const cancelOrderInserted = await CancelOrder.create({
      order_id,
      styleNumber,
      size,
      order_date,
      quantity,
    });

    // 4. Remove from PendingOrder if it exists
    const pendingOrder = await PendingOrder.findOne({ order_id });
    if (pendingOrder) {
      await PendingOrder.findByIdAndDelete(pendingOrder._id);
    }

    // 5. Success response
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          `${cancelOrderInserted.order_id} added to confirm order`,
          cancelOrderInserted
        )
      );
  } catch (error) {
    next(error);
  }
};






module.exports = {addToPendingOrder , addToCancelOrders, addToConfirmOrders,pendingOrders};
