const CancelOrder = require("../models/cancelOrder.modal");
const ApiResponse = require("../utils/ApiResponse");


// get all cancel orders 
const getCancelOrders = async(req,res,next)=>{
    try {
    const cancelOrders = await CancelOrder.find();
    if(cancelOrders.length === 0){
        return new ApiResponse(200,"No cancel orders found");
    }
    res.status(200).json(new ApiResponse(200,"Cancel order fetched successfully.", cancelOrders));
    } catch (error) {
        next(error)
    }
}

module.exports = getCancelOrders;