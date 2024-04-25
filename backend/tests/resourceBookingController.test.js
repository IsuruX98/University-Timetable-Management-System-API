const ResourceBooking = require("../models/resourceBookingModel");
const {
  createResourceBooking,
  updateResourceBooking,
  deleteResourceBooking,
  getAllResourceBookings,
  getResourceBookingById,
} = require("../controllers/resourceBookingController");

jest.mock("../models/resourceBookingModel");

describe("Resource Booking Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createResourceBooking", () => {
    it("should create a new resource booking", async () => {
      const req = {
        body: {
          resourceID: "resourceId",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const savedBooking = {
        _id: "bookingId",
        ...req.body,
      };

      ResourceBooking.findOne.mockResolvedValueOnce(null);
      ResourceBooking.prototype.save.mockResolvedValueOnce(savedBooking);

      await createResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedBooking);
    });
    it("should return 400 if resource is already booked for the same day and time range", async () => {
      const req = {
        body: {
          resourceID: "resourceId",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const existingBooking = { _id: "existingBookingId" };
      ResourceBooking.findOne.mockResolvedValueOnce(existingBooking);

      await createResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource already booked for the same day and time range",
      });
    });

    it("should return 500 if there is an error saving the resource booking", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findOne.mockResolvedValueOnce(null);
      ResourceBooking.prototype.save.mockRejectedValueOnce(
        new Error("Database error")
      );

      await createResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateResourceBooking", () => {
    it("should update a resource booking", async () => {
      const req = {
        params: { id: "bookingId" },
        body: {
          resourceID: "resourceId",
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
      ResourceBooking.findByIdAndUpdate.mockResolvedValueOnce(updatedBooking);

      await updateResourceBooking(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedBooking);
    });

    it("should return 400 if resource is already booked for the same day and time range while updating", async () => {
      const req = {
        params: { id: "bookingId" },
        body: {
          resourceID: "resourceId",
          day: "2024-03-20",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const existingBooking = { _id: "existingBookingId" };
      ResourceBooking.findOne.mockResolvedValueOnce(existingBooking);

      await updateResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource already booked for the same day and time range",
      });
    });

    it("should return 404 if resource booking not found while updating", async () => {
      const req = {
        params: { id: "nonExistentId" },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findByIdAndUpdate.mockResolvedValueOnce(null);

      await updateResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource booking not found",
      });
    });

    it("should return 500 if there is an error updating the resource booking", async () => {
      const req = {
        params: { id: "bookingId" },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database error")
      );

      await updateResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deleteResourceBooking", () => {
    it("should delete a resource booking", async () => {
      const req = {
        params: {
          id: "bookingId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findByIdAndDelete.mockResolvedValueOnce({});

      await deleteResourceBooking(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Resource booking deleted successfully",
      });
    });

    it("should return 404 if resource booking not found while deleting", async () => {
      const req = {
        params: {
          id: "nonExistentId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource booking not found",
      });
    });
  });

  describe("getAllResourceBookings", () => {
    it("should get all resource bookings", async () => {
      const bookings = [{ _id: "bookingId1" }, { _id: "bookingId2" }];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.find.mockResolvedValueOnce(bookings);

      await getAllResourceBookings(req, res);

      expect(res.json).toHaveBeenCalledWith(bookings);
    });

    it("should return 500 if there is an error fetching resource bookings", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.find.mockRejectedValueOnce(new Error("Database error"));

      await getAllResourceBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getResourceBookingById", () => {
    it("should get a resource booking by ID", async () => {
      const req = { params: { id: "bookingId" } };
      const booking = { _id: "bookingId" };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findById.mockResolvedValueOnce(booking);

      await getResourceBookingById(req, res);

      expect(res.json).toHaveBeenCalledWith(booking);
    });

    it("should return 404 if resource booking not found", async () => {
      const req = { params: { id: "nonExistentId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findById.mockResolvedValueOnce(null);

      await getResourceBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource booking not found",
      });
    });

    it("should return 500 if there is an error fetching the resource booking", async () => {
      const req = { params: { id: "bookingId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      ResourceBooking.findById.mockRejectedValueOnce(
        new Error("Database error")
      );

      await getResourceBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
