const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route for creating a room
router.post(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  roomController.createRoom
);

// Route for updating a room
router.put(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  roomController.updateRoom
);

// Route for deleting a room
router.delete(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  roomController.deleteRoom
);

// Route for getting all rooms
router.get("/", roomController.getAllRooms);

// Route for getting a room by ID
router.get("/:id", roomController.getRoomById);

module.exports = router;
