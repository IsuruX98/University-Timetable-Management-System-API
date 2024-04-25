const Faculty = require("../models/facultyModel");
const facultyController = require("../controllers/facultyController");

jest.mock("../models/facultyModel");

describe("Faculty Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createFaculty", () => {
    it("should create a new faculty", async () => {
      const req = {
        body: {
          name: "Maths",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedSavedFaculty = {
        _id: "65f9aee918565b7152af67a1", // Adjust this to match the actual _id returned
        name: "Maths",
        __v: 0,
      };
      Faculty.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(expectedSavedFaculty),
      });

      await facultyController.createFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedSavedFaculty);
      expect(Faculty).toHaveBeenCalledWith({
        name: "Maths",
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
      Faculty.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error("Database error")),
      });

      await facultyController.createFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getAllFaculties", () => {
    it("should get all faculties", async () => {
      const faculties = [
        { _id: "1", name: "Maths", __v: 0 },
        { _id: "2", name: "Physics", __v: 0 },
      ];
      const req = {};
      const res = {
        json: jest.fn(),
      };
      Faculty.find.mockResolvedValueOnce(faculties);

      await facultyController.getAllFaculties(req, res);

      expect(res.json).toHaveBeenCalledWith(faculties);
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Faculty.find.mockRejectedValueOnce(new Error("Database error"));

      await facultyController.getAllFaculties(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getFacultyById", () => {
    it("should get a faculty by ID", async () => {
      const faculty = { _id: "1", name: "Maths", __v: 0 };
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      Faculty.findById.mockResolvedValueOnce(faculty);

      await facultyController.getFacultyById(req, res);

      expect(res.json).toHaveBeenCalledWith(faculty);
    });

    it("should handle faculty not found", async () => {
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      Faculty.findById.mockResolvedValueOnce(null);

      await facultyController.getFacultyById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Faculty not found" });
    });

    it("should handle errors", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Faculty.findById.mockRejectedValueOnce(new Error("Database error"));

      await facultyController.getFacultyById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("updateFaculty", () => {
    it("should update a faculty", async () => {
      const updatedFaculty = { _id: "1", name: "Updated Maths", __v: 0 };
      const req = {
        params: { id: "1" },
        body: { name: "Updated Maths" },
      };
      const res = {
        json: jest.fn(),
      };
      Faculty.findByIdAndUpdate.mockResolvedValueOnce(updatedFaculty);

      await facultyController.updateFaculty(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedFaculty);
    });

    it("should handle errors", async () => {
      const req = {
        params: { id: "1" },
        body: { name: "Updated Maths" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Faculty.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database error")
      );

      await facultyController.updateFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("deleteFaculty", () => {
    it("should delete a faculty", async () => {
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
      };
      Faculty.findByIdAndDelete.mockResolvedValueOnce({});

      await facultyController.deleteFaculty(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Faculty deleted" });
    });

    it("should handle faculty not found", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Faculty.findByIdAndDelete.mockResolvedValueOnce(null);

      await facultyController.deleteFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Faculty not found" });
    });

    it("should handle errors", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Faculty.findByIdAndDelete.mockRejectedValueOnce(
        new Error("Database error")
      );

      await facultyController.deleteFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
