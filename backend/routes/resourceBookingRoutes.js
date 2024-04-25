const express = require("express");
const router = express.Router();
const resourceBookingController = require("../controllers/resourceBookingController");
const { protect } = require("../middleware/authMiddleware");

// Route to create a new resource booking
router.post("/", protect, resourceBookingController.createResourceBooking);

// Route to get a resource booking by ID
router.put("/:id", protect, resourceBookingController.updateResourceBooking);

// Route to get all resource bookings
router.get("/", protect, resourceBookingController.getAllResourceBookings);

// Route to get a resource booking by ID
router.get("/:id", protect, resourceBookingController.getResourceBookingById);

// Route to delete a resource booking by ID
router.delete("/:id", protect, resourceBookingController.deleteResourceBooking);

module.exports = router;
