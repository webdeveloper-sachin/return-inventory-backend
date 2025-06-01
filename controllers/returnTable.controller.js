const ReturnTable = require("../models/returnTable.modal");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");


// create return record
const addReturnTableRecord = async (req, res, next) => {
  try {
    const { styleNumber, size, color, channel, employee_name, order_id } = req.body;

    // Check for missing fields
    if (
      [styleNumber, size, color, channel, employee_name, order_id].some(
        (field) => !field
      )
    ) {
      throw new ApiError(409, "All fields are required");
    }

    // Check if order_id already exists
    const orderIDExists = await ReturnTable.findOne({ order_id });
    if (orderIDExists) {
      throw new ApiError(409, `${order_id} already exists, please scan a new Order ID.`);
    }

    // Create the return record
    const addedRecord = await ReturnTable.create({
      styleNumber,
      size,
      color,
      channel,
      location:"Return Table",
      employee_name,
      order_id,
    });

    // Send success response with data
    res.status(201).json(
      new ApiResponse(201, "Return record added successfully!", addedRecord)
    );
  } catch (error) {
    next(error);
  }
};


// get return record

const getReturnTableRecords = async(_,res,next)=>{
    try {
        const records = await ReturnTable.find();
        if(!records){
            throw new ApiError(409,"Records not found");
        }
    res.status(200).json(new ApiResponse(200,"Records fetched successfully",records))
    } catch (error) {
        next(error)
    }
}

// delete return record
const deleteReturnTableRecord = async(req,res,next)=>{
    try {
        const {order_id} = req.body;
        if(!order_id){
            throw new ApiError(409,"order_id required");
        }
        const findRecord = await ReturnTable.findOne({order_id});
        if(!findRecord){
          throw new ApiError(404,"Record not found");
        }
        await ReturnTable.findByIdAndDelete(findRecord._id);
        res.status(200).json(new ApiResponse(200,`${order_id} deleted successfully!.`));

    } catch (error) {
        next(error)
    }
}


module.exports = {addReturnTableRecord,getReturnTableRecords,deleteReturnTableRecord}