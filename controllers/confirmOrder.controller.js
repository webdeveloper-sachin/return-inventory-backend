const ConfirmOrder = require("../models/confirmOrder.modal");
const ShippedOrders = require("../models/shopifyShippedOrder.modal");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getConfirmOrders = async(_,res,next)=>{
    try {
        const confirmOrders = await ConfirmOrder.find();
        if(confirmOrders.length===0){
            return res.status(200).json(new ApiResponse(200,"No confirm records found",confirmOrders));
        }

        res.status(200).json(new ApiResponse(200,"Confirm order fetched successfully!.",confirmOrders));
    } catch (error) {
        next(error);
    }
}

const addToShip = async(req,res,next)=>{
    try {
        const {order_id, styleNumber, size, quantity,order_date} = req.body;

        if(
            [order_date,order_id,styleNumber,size,quantity,].some((item)=>!item)
        ){
            return new ApiError(400,"All fields required");
        }

        const orderIdExists = await ShippedOrders.findOne({order_id});
        if(orderIdExists){
            return new ApiError(400,`${order_id} order already shipped.`);
        }

        const insertedShippedOrders = await ShippedOrders.create({
            order_id,order_date,styleNumber,size,quantity
        })

        res.status(201).json(new ApiResponse(201,`${order_id} shipped`, insertedShippedOrders));


    } catch (error) {
        next(error)
    }
}





module.exports = {getConfirmOrders, addToShip}