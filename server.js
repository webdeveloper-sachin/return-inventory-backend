require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const ApiError = require("./utils/ApiError");
const app = express();
const returnTableRoutes = require("./routes/returnTable.route");
const pressTableRoutes = require("./routes/pressTable.route");
const shipReturnRoutes = require("./routes/shipReturn.route");

const PORT = process.env.PORT || 5000;

// global middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// routes middlewares 
app.use("/api/v1/return-table",returnTableRoutes);
app.use("/api/v1/press-table",pressTableRoutes);
app.use("/api/v1/ship-record",shipReturnRoutes)


// mongodb connection 
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`The server is running on ${PORT}`);
    })
})
.catch((error)=>{
    throw new ApiError(500,"Failed to connect with database!")
})


// global error middleware
app.use(globalErrorHandler);