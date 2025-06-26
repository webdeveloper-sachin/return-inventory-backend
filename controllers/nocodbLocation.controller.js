const axios = require("axios");
const ApiResponse = require("../utils/ApiResponse");

const MAX_RECORDS = 20000;
const BATCH_SIZE = 500;
const CONCURRENCY_LIMIT = 10; // Max parallel requests at a time
const RETRY_LIMIT = 3;

const API_HEADERS = {
  "xc-token": "LsOnEY-1wS4Nqjz15D1_gxHu0pFVcmA_5LNqCAqK",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchBatch = async (offset, retryCount = 0) => {
  const url = `https://nocodb.qurvii.com/api/v2/tables/mhhxiprapvyqjtf/records?offset=${offset}&limit=${BATCH_SIZE}&viewId=vw7oelmdnxn5leeh`;

  try {
    const response = await axios.get(url, { headers: API_HEADERS });
    return response.data.list || [];
  } catch (err) {
    if (retryCount < RETRY_LIMIT) {
      console.warn(`🔁 Retry (${retryCount + 1}) for offset ${offset}`);
      await sleep(1000 * (retryCount + 1)); // Exponential backoff
      return fetchBatch(offset, retryCount + 1);
    } else {
      console.error(`❌ Failed to fetch offset ${offset} after retries`);
      return [];
    }
  }
};

const getAllRecordsFromNocoDb = async (req, res, next) => {
  const totalBatches = Math.ceil(MAX_RECORDS / BATCH_SIZE);
  const offsets = Array.from({ length: totalBatches }, (_, i) => i * BATCH_SIZE);
  const allRecords = [];

  console.log(`📦 Fetching up to ${MAX_RECORDS} records in ${totalBatches} batches...`);

  try {
    let index = 0;

    while (index < offsets.length) {
      const chunk = offsets.slice(index, index + CONCURRENCY_LIMIT);
      const promises = chunk.map((offset) => fetchBatch(offset));

      const results = await Promise.allSettled(promises);

      for (const result of results) {
        if (result.status === "fulfilled") {
          allRecords.push(...result.value);
        } else {
          console.error("⚠️ Batch failed:", result.reason);
        }
      }

      index += CONCURRENCY_LIMIT;
      console.log(`✅ Progress: ${allRecords.length} records fetched`);
    }

    res.status(200).json(
      new ApiResponse(200, "All locations fetched successfully", {
        length: allRecords.length,
        records: allRecords,
      })
    );
  } catch (err) {
    console.error("🚨 Error during fetch:", err);
    next(err);
  }
};

module.exports = getAllRecordsFromNocoDb;
