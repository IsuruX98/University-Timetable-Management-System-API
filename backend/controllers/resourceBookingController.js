const ResourceBooking = require("../models/resourceBookingModel");

// Controller to create a new resource booking
exports.createResourceBooking = async (req, res) => {
  try {
    const { resourceID, day, startTime, endTime } = req.body;

    // Check if there's already a booking for the same resource, day, and overlapping time range
    const existingBooking = await ResourceBooking.findOne({
      resourceID,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } },
          ],
        }, // Check if start time is within existing booking
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } },
          ],
        }, // Check if end time is within existing booking
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        }, // Check if existing booking is within the new time range
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Resource already booked for the same day and time range",
      });
    }

    const resourceBooking = new ResourceBooking(req.body);
    const savedBooking = await resourceBooking.save(); // Fetch the saved booking
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a resource booking
exports.updateResourceBooking = async (req, res) => {
  try {
    const { resourceID, day, startTime, endTime } = req.body;
    const bookingId = req.params.id;

    // Check if there's already a booking for the same resource, day, and overlapping time range excluding the current booking being updated
    const existingBooking = await ResourceBooking.findOne({
      resourceID,
      day,
      _id: { $ne: bookingId }, // Exclude the current booking being updated
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } },
          ],
        }, // Check if start time is within existing booking
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } },
          ],
        }, // Check if end time is within existing booking
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        }, // Check if existing booking is within the new time range
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Resource already booked for the same day and time range",
      });
    }

    // Update the resource booking
    const updatedBooking = await ResourceBooking.findByIdAndUpdate(
      bookingId,
      req.body,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Resource booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all resource bookings
exports.getAllResourceBookings = async (req, res) => {
  try {
    const resourceBookings = await ResourceBooking.find();
    res.status(200).json(resourceBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a resource booking by ID
exports.getResourceBookingById = async (req, res) => {
  try {
    const resourceBooking = await ResourceBooking.findById(req.params.id);
    if (!resourceBooking) {
      return res.status(404).json({ message: "Resource booking not found" });
    }
    res.status(200).json(resourceBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a resource booking by ID
exports.deleteResourceBooking = async (req, res) => {
  try {
    const resourceBooking = await ResourceBooking.findByIdAndDelete(
      req.params.id
    );
    if (!resourceBooking) {
      return res.status(404).json({ message: "Resource booking not found" });
    }
    res.status(200).json({ message: "Resource booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
