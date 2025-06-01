# 📦 Return Inventory Management System

This is a **Return Inventory Management System** designed to handle the flow of returned products by scanning the QR code from MRP tags. Based on the selected department during scanning, the item transitions between various states — from being returned, to pressed, and finally shipped.

---

## 🚀 Features

- Scan QR codes to fetch product details using **Order ID**.
- Automatically fetches: `Style Number`, `Size`, `Color`.
- Manages the return lifecycle across departments:
  - **Return Table**: First scan entry — product is recorded here.
  - **Press Table**: If `Press Department` is selected, the item is removed from the return table and shown here.
  - **Shipped Table**: If `Ship Department` is selected, the item moves from the press table to shipped state.
- Real-time API endpoints for each department's inventory.

---

## 🏗️ Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** for database
- **dotenv** for environment management
- **CORS** for cross-origin requests
- **Custom Error Handling Middleware**

---

## 🧩 Project Structure
return-inventory/
│
├── routes/
│ ├── returnTable.route.js
│ ├── pressTable.route.js
│ └── shipReturn.route.js
│
├── middlewares/
│ └── globalErrorHandler.js
│
├── db/
│ └── connectDB.js
│
├── utils/
│ └── ApiError.js
│
├── .env
├── app.js (or index.js)
└── README.md



---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/return-inventory.git
cd return-inventory


| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/v1/return-table`      | Fetch all returned products    |
| POST   | `/api/v1/return-table/scan` | Scan and add to return table   |
| GET    | `/api/v1/press-table`       | Fetch all items in press table |
| POST   | `/api/v1/press-table/scan`  | Scan and move to press table   |
| GET    | `/api/v1/ship-record`       | Fetch all shipped records      |
| POST   | `/api/v1/ship-record/scan`  | Scan and move to shipped table |


🔁 Workflow
Return Scan:

User scans MRP QR Code for the first time.

Selects department: e.g. Return.

Item appears in the Return Table.

Press Scan:

Next scan selects Press.

Item moves from Return Table ➡️ Press Table.

Ship Scan:

Final scan selects Ship.

Item moves from Press Table ➡️ Shipped Records.

