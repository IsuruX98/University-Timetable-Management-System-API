const mongoose = require("mongoose");

const roomBookingSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  reason: String,
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);

module.exports = RoomBooking;
