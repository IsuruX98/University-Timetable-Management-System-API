const express = require("express");
const router = express.Router();
const roomBookingController = require("../controllers/roomBookingController");
const { protect } = require("../middleware/authMiddleware");

// Route for creating a booking
router.post("/", protect, roomBookingController.createBooking);

// Route for updating a booking
router.put("/:id", protect, roomBookingController.updateBooking);

// Route for deleting a booking
router.delete("/:id", protect, roomBookingController.deleteBooking);

// Route for getting all bookings
router.get("/", protect, roomBookingController.getAllBookings);

// Route for getting a booking by ID
router.get("/:id", protect, roomBookingController.getBookingById);

module.exports = router;
