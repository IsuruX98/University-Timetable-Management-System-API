const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route for creating a notification
router.post(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  notificationController.createNotification
);

// Route for deleting a notification by ID
router.delete("/:id", protect, notificationController.deleteNotificationById);

// Route for getting all notifications
router.get(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  notificationController.getAllNotifications
);

// Route for getting a notification by ID
router.get("/:id", notificationController.getNotificationById);

// Route for getting notifications by user ID
router.get("/user/:userID", notificationController.getNotificationsByUserId);

module.exports = router;
