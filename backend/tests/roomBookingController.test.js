const RoomBooking = require("../models/roomBookingModel");
const Timetable = require("../models/timetableModel");
const {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
} = require("../controllers/roomBookingController");

jest.mock("../models/roomBookingModel");
jest.mock("../models/timetableModel");

describe("Booking Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a new booking", async () => {
      const req = {
        body: {
          userID: "userId",
          roomID: "roomId",
          reason: "Meeting",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const savedBooking = { _id: "bookingId", ...req.body };
      RoomBooking.findOne.mockResolvedValueOnce(null);
      Timetable.findOne.mockResolvedValueOnce(null);
      RoomBooking.prototype.save.mockResolvedValueOnce(savedBooking);

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedBooking);
    });

    it("should return 400 if room is already allocated in timetable during specified time", async () => {
      const req = {
        body: {
          userID: "userId",
          roomID: "roomId",
          reason: "Meeting",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findOne.mockResolvedValueOnce({});
      RoomBooking.findOne.mockResolvedValueOnce(null);

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Room is already allocated in the timetable during the specified time",
      });
    });

    it("should return 500 if there is an error saving the booking", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.findOne.mockResolvedValueOnce(null);
      Timetable.findOne.mockResolvedValueOnce(null);
      RoomBooking.prototype.save.mockRejectedValueOnce(
        new Error("Database error")
      );

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });

    it("should return 500 if there is an error checking room availability in timetable", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findOne.mockRejectedValueOnce(new Error("Database error"));

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateBooking", () => {
    it("should update a booking", async () => {
      const req = {
        params: { id: "bookingId" },
        body: {
          userID: "userId",
          roomID: "roomId",
          reason: "Meeting",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const updatedBooking = { _id: "bookingId", ...req.body };
      RoomBooking.findByIdAndUpdate.mockResolvedValueOnce(updatedBooking);

      await updateBooking(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedBooking);
    });

    it("should return 500 if there is an error updating the booking", async () => {
      const req = {
        params: { id: "bookingId" },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database error")
      );

      await updateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking", async () => {
      const req = {
        params: {
          id: "bookingId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      RoomBooking.findByIdAndDelete.mockResolvedValueOnce({});

      await deleteBooking(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "room booking deleted",
      });
    });

    it("should return 404 if booking not found", async () => {
      const req = {
        params: {
          id: "nonExistentId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "room booking not found",
      });
    });
  });

  describe("getAllBookings", () => {
    it("should get all bookings", async () => {
      const bookings = [{ _id: "bookingId1" }, { _id: "bookingId2" }];
      const req = {};
      const res = {
        json: jest.fn(),
      };
      RoomBooking.find.mockResolvedValueOnce(bookings);

      await getAllBookings(req, res);

      expect(res.json).toHaveBeenCalledWith(bookings);
    });

    it("should return 500 if there is an error fetching bookings", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.find.mockRejectedValueOnce(new Error("Database error"));

      await getAllBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getBookingById", () => {
    it("should get a booking by ID", async () => {
      const req = { params: { id: "bookingId" } };
      const booking = { _id: "bookingId" };
      const res = {
        json: jest.fn(),
      };
      RoomBooking.findById.mockResolvedValueOnce(booking);

      await getBookingById(req, res);

      expect(res.json).toHaveBeenCalledWith(booking);
    });

    it("should return 404 if booking not found", async () => {
      const req = { params: { id: "nonExistentId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.findById.mockResolvedValueOnce(null);

      await getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Booking not found" });
    });

    it("should return 500 if there is an error fetching the booking", async () => {
      const req = { params: { id: "bookingId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      RoomBooking.findById.mockRejectedValueOnce(new Error("Database error"));

      await getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
