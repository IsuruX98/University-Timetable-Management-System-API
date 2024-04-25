const Room = require("../models/roomModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Controller for creating a room
async function createRoom(req, res) {
  try {
    const { roomName, building, floor, capacity } = req.body;
    const newRoom = new Room({
      roomName,
      building,
      floor,
      capacity,
    });
    const savedRoom = await newRoom.save();

    // Fetch all users
    const users = await User.find();

    // Create notifications for each user
    const notifications = users.map((user) => {
      return new Notification({
        userID: user._id,
        message: `A new room '${roomName}' has been created in building ${building}`,
      });
    });

    // Save notifications to database
    await Notification.insertMany(notifications);

    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for updating a room
async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const { roomName, building, floor, capacity } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        roomName,
        building,
        floor,
        capacity,
      },
      { new: true }
    );

    // Fetch all users
    const users = await User.find();

    // Create notifications for each user
    const notifications = users.map((user) => {
      return new Notification({
        userID: user._id,
        message: `Room '${roomName}' in building ${building} has been updated`,
      });
    });

    // Save notifications to database
    await Notification.insertMany(notifications);

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for deleting a room
async function deleteRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Fetch all users
    const users = await User.find();

    // Create notifications for each user
    const notifications = users.map((user) => {
      return new Notification({
        userID: user._id,
        message: `Room '${room.roomName}' in building ${room.building} has been deleted`,
      });
    });

    // Save notifications to database
    await Notification.insertMany(notifications);

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all rooms
async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting a room by ID
async function getRoomById(req, res) {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
};
