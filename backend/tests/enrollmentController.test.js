const Enrollment = require("../models/enrollmentModel");
const {
  enrollUser,
  unenrollUser,
  getAllEnrollments,
} = require("../controllers/enrollmentController");

jest.mock("../models/enrollmentModel");

describe("Enrollment Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("enrollUser", () => {
    it("should enroll a user in a course", async () => {
      const req = {
        body: {
          userID: "userId",
          courseID: "courseId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const savedEnrollment = {
        _id: "enrollmentId",
        ...req.body,
      };

      Enrollment.findOne.mockResolvedValueOnce(null);
      Enrollment.prototype.save.mockResolvedValueOnce(savedEnrollment);

      await enrollUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedEnrollment);
    });

    it("should return 400 if user is already enrolled in the course", async () => {
      const req = {
        body: {
          userID: "userId",
          courseID: "courseId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const existingEnrollment = { _id: "existingEnrollmentId" };
      Enrollment.findOne.mockResolvedValueOnce(existingEnrollment);

      await enrollUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User is already enrolled in the course",
      });
    });

    it("should return 500 if there is an error saving the enrollment", async () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Enrollment.findOne.mockResolvedValueOnce(null);
      Enrollment.prototype.save.mockRejectedValueOnce(
        new Error("Database error")
      );

      await enrollUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("unenrollUser", () => {
    it("should unenroll a user from a course", async () => {
      const req = {
        body: {
          userID: "userId",
          courseID: "courseId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const enrollment = { _id: "enrollmentId" };
      Enrollment.findOneAndDelete.mockResolvedValueOnce(enrollment);

      await unenrollUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "User unenrolled from the course",
      });
    });

    it("should return 404 if enrollment not found while unenrolling", async () => {
      const req = {
        body: {
          userID: "userId",
          courseID: "courseId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Enrollment.findOneAndDelete.mockResolvedValueOnce(null);

      await unenrollUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Enrollment not found",
      });
    });

    it("should return 500 if there is an error unenrolling the user", async () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Enrollment.findOneAndDelete.mockRejectedValueOnce(
        new Error("Database error")
      );

      await unenrollUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getAllEnrollments", () => {
    it("should get all enrollments", async () => {
      const enrollments = [{ _id: "enrollmentId1" }, { _id: "enrollmentId2" }];
      const req = {};
      const res = {
        json: jest.fn(),
      };

      Enrollment.find.mockResolvedValueOnce(enrollments);

      await getAllEnrollments(req, res);

      expect(res.json).toHaveBeenCalledWith(enrollments);
    });

    it("should return 500 if there is an error fetching enrollments", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Enrollment.find.mockRejectedValueOnce(new Error("Database error"));

      await getAllEnrollments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
