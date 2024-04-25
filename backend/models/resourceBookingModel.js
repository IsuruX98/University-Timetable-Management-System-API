const mongoose = require("mongoose");

const resourceBookingSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resourceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
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

const ResourceBooking = mongoose.model(
  "ResourceBooking",
  resourceBookingSchema
);

module.exports = ResourceBooking;
