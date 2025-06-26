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
const inventoryTableRoutes = require("./routes/inventoryTable.route");
// const mrpLabelRoutes = require("./routes/labelRoutes");
// const nocodbRoutes = require("./routes/nocoDB.routes");
const shopifyPendingOrdersRoutes = require("./routes/pendingOrder.routes")
const shopifyCancelOrdersRoute = require("./routes/cancelOrder.routes");
const shopifyConfirmOrdersRoutes = require("./routes/confirmOrder.routes");

const PORT = process.env.PORT || 5000;

// global middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// routes middlewares for return inventory management
app.use("/api/v1/return-table",returnTableRoutes);
app.use("/api/v1/press-table",pressTableRoutes);
app.use("/api/v1/ship-record",shipReturnRoutes)
app.use("/api/v1/inventory-table",inventoryTableRoutes);



// routes  for MRP TAG generation
// app.use("/api/v1/label",mrpLabelRoutes);



// routes for NOCO DB records 
// app.use("/api/v1/nocodb",nocodbRoutes);



// routes for shopify order management 
app.use("/api/v1/shopify",shopifyPendingOrdersRoutes);
app.use("/api/v1/shopify",shopifyCancelOrdersRoute);
app.use("/api/v1/shopify",shopifyConfirmOrdersRoutes);


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