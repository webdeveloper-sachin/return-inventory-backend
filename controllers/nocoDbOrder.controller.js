const axios = require("axios");
const ApiResponse = require("../utils/ApiResponse");

const getAllOrdersRecordsFromNocoDb = async (req, res, next) => {
  const MAX_RECORDS = 10000;
  const BATCH_SIZE = 500;
  const API_HEADERS = {
    "xc-token": "LsOnEY-1wS4Nqjz15D1_gxHu0pFVcmA_5LNqCAqK",
  };

  let allOrders = [];
  const totalBatches = Math.ceil(MAX_RECORDS / BATCH_SIZE);

  try {
    for (let i = 0; i < totalBatches; i += 5) {
      const batchPromises = [];

      for (let j = 0; j < 5 && i + j < totalBatches; j++) {
        const offset = (i + j) * BATCH_SIZE;
        const url = `https://nocodb.qurvii.com/api/v2/tables/m5rt138j272atfc/records?offset=${offset}&limit=${BATCH_SIZE}&viewId=vwi961elxbm8g0gr`;

        batchPromises.push(
          axios.get(url, { headers: API_HEADERS }).then((res) => res.data)
        );
      }

      const batchResults = await Promise.all(batchPromises);
      const batchRecords = batchResults.flatMap((data) => data.list || []);
      allOrders.push(...batchRecords);

      // Stop early if max records reached
      if (allOrders.length >= MAX_RECORDS) break;
    }

    res.status(200).json(
      new ApiResponse(200, allOrders, "All orders fetched successfully")
    );
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    next(error);
  }
};

module.exports = getAllOrdersRecordsFromNocoDb;
