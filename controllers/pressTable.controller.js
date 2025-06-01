const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const PressTable =  require("../models/pressTable.modal");
const ReturnTable = require("../models/returnTable.modal");

// get records 
const getPressTableRecords = async(_,res,next)=>{
    try {
        const records = await PressTable.find();
        if(!records){
            throw new ApiError(404,"Recods not found!.");
        }
        res.status(200).json(new ApiResponse(200,"Records fetched successfully",records));
    } catch (error) {
        next(error)
    }
}

// create record 

const createPressTableRecord = async (req, res, next) => {
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
    const orderIDExists = await PressTable.findOne({ order_id });
    if (orderIDExists) {
      throw new ApiError(409, `${order_id} already exists, please scan a new Order ID.`);
    }

    // Create the press table record
    const addedRecord = await PressTable.create({
      styleNumber,
      size,
      color,
      channel,
      location:"Press Table",
      employee_name,
      order_id,
    });

    // Delete matching record from return table
    const returnTableRecord = await ReturnTable.findOne({ order_id });
    if (!returnTableRecord) {
     return res.status(201).json(new ApiResponse(201, "Record not found in return table but Added in Press Table",addedRecord));
    }

    const deletedRecord = await ReturnTable.findByIdAndDelete(returnTableRecord._id);
    if (!deletedRecord) {
      throw new ApiError(500, "Failed to delete from Return Table");
    }

    // Send success response
    res.status(201).json(
      new ApiResponse(
        201,
        "Record added to Press Table and deleted from Return Table.",
        addedRecord
      )
    );
  } catch (error) {
    next(error);
  }
};


//delete record 
const deletePressTableRecord = async(req,res,next)=>{
 try {
       const {order_id} = req.body;
       if(!order_id){
           throw new ApiError(409,"order_id required");
       }
       const findRecord = await PressTable.findOne({order_id});
       if(!findRecord){
           throw new ApiError(404,`${order_id} not found`);
       }
        await PressTable.findByIdAndDelete(findRecord._id);
       res.status(200).json(new ApiResponse(200,`${order_id} deleted successfully.`));
   
 } catch (error) {
    next(error)
 }
}

module.exports = {getPressTableRecords,createPressTableRecord,deletePressTableRecord};