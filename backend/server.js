const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
const connectDB = require("./config/db");
connectDB();

// Routes

//user
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/course", require("./routes/courseRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/room", require("./routes/roomRoutes"));
app.use("/api/resource", require("./routes/resourceRoutes"));
app.use("/api/roombooking", require("./routes/roomBookingRoutes"));
app.use("/api/resourcebooking", require("./routes/resourceBookingRoutes"));
app.use("/api/enrollment", require("./routes/enrollmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Start the Server
const server = app.listen(port, () =>
  console.log(`Server running on port ${port} 🔥`)
);
