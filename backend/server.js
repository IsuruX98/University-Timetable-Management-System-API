const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = require("./config/db");
connectDB();

// Routes

// Start the Server
const server = app.listen(port, () =>
  console.log(`Server running on port ${port} 🔥`)
);
