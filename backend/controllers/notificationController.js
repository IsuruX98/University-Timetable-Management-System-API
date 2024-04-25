const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Controller for creating a notification
async function createNotification(req, res) {
  try {
    const { userID, message } = req.body;
    const newNotification = new Notification({ userID, message });
    const savedNotification = await newNotification.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for deleting a notification by ID
async function deleteNotificationById(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all notifications
async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting a notification by ID
async function getNotificationById(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting notifications by user ID
async function getNotificationsByUserId(req, res) {
  try {
    const { userID } = req.params;
    const notifications = await Notification.find({ userID });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createNotification,
  deleteNotificationById,
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
};
