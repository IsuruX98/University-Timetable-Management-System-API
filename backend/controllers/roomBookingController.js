const RoomBooking = require("../models/roomBookingModel");
const Timetable = require("../models/timetableModel");

async function createBooking(req, res) {
  try {
    const { userID, roomID, reason, day, startTime, endTime } = req.body;

    // Check if room is available in timetable
    const timetableConflict = await Timetable.findOne({
      location: roomID,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
    });

    if (timetableConflict) {
      return res.status(400).json({
        message:
          "Room is already allocated in the timetable during the specified time",
      });
    }

    // Check if there are conflicting bookings on the same day
    const bookingConflict = await RoomBooking.findOne({
      roomID,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
    });

    if (bookingConflict) {
      return res
        .status(400)
        .json({ message: "There is a conflicting booking at the same time" });
    }

    const newBooking = new RoomBooking({
      userID,
      roomID,
      reason,
      day,
      startTime,
      endTime,
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { userID, roomID, reason, day, startTime, endTime } = req.body;

    // Check if room is available in timetable
    const timetableConflict = await Timetable.findOne({
      location: roomID,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
    });

    if (timetableConflict) {
      return res.status(400).json({
        message:
          "Room is already allocated in the timetable during the specified time",
      });
    }

    // Check if there are conflicting bookings on the same day, excluding the current booking
    const bookingConflict = await RoomBooking.findOne({
      roomID,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
      _id: { $ne: id }, // Exclude the current booking from the conflict check
    });

    if (bookingConflict) {
      return res
        .status(400)
        .json({ message: "There is a conflicting booking at the same time" });
    }

    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      id,
      {
        userID,
        roomID,
        reason,
        day,
        startTime,
        endTime,
      },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const roombooking = await RoomBooking.findByIdAndDelete(id);

    if (!roombooking) {
      return res.status(404).json({ message: "room booking not found" });
    }

    res.json({ message: "room booking deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await RoomBooking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await RoomBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
};
