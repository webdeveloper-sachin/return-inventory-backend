// controllers/printMrpLabel.js
const axios = require("axios");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const SYNC_ORDER_API = "https://fastapi.qurvii.com/sync-orders";
const ORDERS_API = "https://inventorybackend-m1z8.onrender.com/api/product";

const printMrpLable = async (req, res, next) => {
  try {
    const { styleNumber, size } = req.body;
    if (!styleNumber || !size) throw new ApiError(409, "All fields required.");

    const response = await axios.get(ORDERS_API);
    const productList = response.data || [];

    const matchedProduct = productList.find(
      (p) => String(p.style_code) === String(styleNumber)
    );

    const color = matchedProduct?.color || "Other";
    const mrp = matchedProduct?.mrp || "N/A";

    const validData = {
      channel: "New",
      style_number: styleNumber,
      size,
      color,
      status: "shipped",
      found_in_inventory: "Yes",
    };

    const syncResponse = await axios.post(SYNC_ORDER_API, [validData]);
    const syncedOrder = syncResponse.data?.all_orders?.[0].data;

    const tagDetails = {
      styleNumber,
      size,
      color,
      mrp,
      brand: "Qurvii",
      unit: "1 Pcs",
      mfg: "Qurvii, 2nd floor, B-149, Sector-6, Noida, UP, 201301",
      contact: "support@qurvii.com",
      product_name: matchedProduct?.style_name || "Qurvii Product",
    };

    res.status(200).json(
      new ApiResponse(200, "Order synced", {
        synced: syncResponse.data,
        tag: tagDetails,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = printMrpLable;
