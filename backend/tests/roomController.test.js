const Room = require("../models/roomModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const roomController = require("../controllers/roomController");

// Mocking the Room model methods
jest.mock("../models/roomModel");
jest.mock("../models/notificationModel");
jest.mock("../models/userModel");

describe("Room Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for createRoom function
  describe("createRoom", () => {
    it("should create a new room", async () => {
      const req = {
        body: {
          roomName: "Room 101",
          building: "Main Building",
          floor: 1,
          capacity: 50,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedSavedRoom = {
        _id: "someId",
        roomName: "Room 101",
        building: "Main Building",
        floor: 1,
        capacity: 50,
      };
      Room.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(expectedSavedRoom),
      });
      User.find.mockResolvedValueOnce([{ _id: "user1" }, { _id: "user2" }]);
      Notification.insertMany.mockResolvedValueOnce([
        "notification1",
        "notification2",
      ]);

      await roomController.createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedSavedRoom);
      expect(Room).toHaveBeenCalledWith({
        roomName: "Room 101",
        building: "Main Building",
        floor: 1,
        capacity: 50,
      });
      expect(Notification).toHaveBeenCalledWith({
        userID: "user1",
        message: `A new room 'Room 101' has been created in building Main Building`,
      });
      expect(Notification).toHaveBeenCalledWith({
        userID: "user2",
        message: `A new room 'Room 101' has been created in building Main Building`,
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error("Database error")),
      });

      await roomController.createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for updateRoom function
  describe("updateRoom", () => {
    it("should update an existing room", async () => {
      const req = {
        params: {
          id: "roomId",
        },
        body: {
          roomName: "Updated Room",
          building: "Main Building",
          floor: 2,
          capacity: 60,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const updatedRoom = {
        _id: "roomId",
        roomName: "Updated Room",
        building: "Main Building",
        floor: 2,
        capacity: 60,
      };
      Room.findByIdAndUpdate.mockResolvedValueOnce(updatedRoom);
      User.find.mockResolvedValueOnce([{ _id: "user1" }, { _id: "user2" }]);
      Notification.insertMany.mockResolvedValueOnce([
        "notification1",
        "notification2",
      ]);

      await roomController.updateRoom(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedRoom);
      expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
        "roomId",
        {
          roomName: "Updated Room",
          building: "Main Building",
          floor: 2,
          capacity: 60,
        },
        { new: true }
      );
      expect(Notification).toHaveBeenCalledWith({
        userID: "user1",
        message: `Room 'Updated Room' in building Main Building has been updated`,
      });
      expect(Notification).toHaveBeenCalledWith({
        userID: "user2",
        message: `Room 'Updated Room' in building Main Building has been updated`,
      });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "roomId",
        },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.findByIdAndUpdate.mockRejectedValueOnce(new Error("Database error"));

      await roomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for deleteRoom function
  describe("deleteRoom", () => {
    it("should delete an existing room", async () => {
      const req = {
        params: {
          id: "roomId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const deletedRoom = {
        _id: "roomId",
        roomName: "Deleted Room",
        building: "Main Building",
      };
      Room.findByIdAndDelete.mockResolvedValueOnce(deletedRoom);
      User.find.mockResolvedValueOnce([{ _id: "user1" }, { _id: "user2" }]);
      Notification.insertMany.mockResolvedValueOnce([
        "notification1",
        "notification2",
      ]);

      await roomController.deleteRoom(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Room deleted" });
      expect(Room.findByIdAndDelete).toHaveBeenCalledWith("roomId");
      expect(Notification).toHaveBeenCalledWith({
        userID: "user1",
        message: `Room 'Deleted Room' in building Main Building has been deleted`,
      });
      expect(Notification).toHaveBeenCalledWith({
        userID: "user2",
        message: `Room 'Deleted Room' in building Main Building has been deleted`,
      });
    });

    it("should handle room not found", async () => {
      const req = {
        params: {
          id: "nonexistentRoomId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.findByIdAndDelete.mockResolvedValueOnce(null);

      await roomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "roomId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.findByIdAndDelete.mockRejectedValueOnce(new Error("Database error"));

      await roomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for getAllRooms function
  describe("getAllRooms", () => {
    it("should get all rooms", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const rooms = [
        { _id: "room1", roomName: "room1", building: "Building A" },
        { _id: "room2", roomName: "room2", building: "Building B" },
        { _id: "room3", roomName: "room3", building: "Building C" },
      ];
      Room.find.mockResolvedValueOnce(rooms);

      await roomController.getAllRooms(req, res);

      expect(res.json).toHaveBeenCalledWith(rooms);
      expect(Room.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.find.mockRejectedValueOnce(new Error("Database error"));

      await roomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Test for getRoomById function
  describe("getRoomById", () => {
    it("should get a room by ID", async () => {
      const req = {
        params: {
          id: "roomId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const room = {
        _id: "roomId",
        roomName: "Test Room",
        building: "Test Building",
      };
      Room.findById.mockResolvedValueOnce(room);

      await roomController.getRoomById(req, res);

      expect(res.json).toHaveBeenCalledWith(room);
      expect(Room.findById).toHaveBeenCalledWith("roomId");
    });

    it("should handle room not found", async () => {
      const req = {
        params: {
          id: "nonexistentRoomId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.findById.mockResolvedValueOnce(null);

      await roomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "roomId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Room.findById.mockRejectedValueOnce(new Error("Database error"));

      await roomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
