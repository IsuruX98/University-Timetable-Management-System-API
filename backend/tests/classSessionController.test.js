const Timetable = require("../models/timetableModel");
const Notification = require("../models/notificationModel");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const {
  addClassSession,
  updateClassSession,
  deleteClassSession,
  getAllClassSessions,
  getClassSessionById,
} = require("../controllers/timetableController");

jest.mock("../models/timetableModel");
jest.mock("../models/notificationModel");
jest.mock("../models/enrollmentModel");
jest.mock("../models/courseModel");

describe("Class Session Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addClassSession", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should add a class session", async () => {
      const req = {
        body: {
          courseID: "courseId",
          week: "1",
          day: "2024-03-25",
          startTime: "10:00",
          endTime: "12:00",
          facultyID: "facultyId",
          location: "Classroom 101",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const savedSession = { _id: "sessionId" };
      const course = { courseName: "Mathematics" };
      const enrolledUsers = [{ userID: "userId1" }, { userID: "userId2" }];
      const notifications = [
        {
          userID: "userId1",
          message: "A new class session has been added for course Mathematics",
        },
        {
          userID: "userId2",
          message: "A new class session has been added for course Mathematics",
        },
      ];

      Timetable.find.mockResolvedValueOnce([]);
      Timetable.prototype.save.mockResolvedValueOnce(savedSession);
      Course.findById.mockResolvedValueOnce(course);
      Enrollment.find.mockResolvedValueOnce(enrolledUsers);
      Notification.mockImplementation(() => ({
        save: () => Promise.resolve(),
      }));

      await addClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedSession);
    });

    it("should return 400 if session overlaps with existing sessions", async () => {
      const req = {
        body: {
          courseID: "courseId",
          week: "1",
          day: "2024-03-25",
          startTime: "10:00",
          endTime: "12:00",
          facultyID: "facultyId",
          location: "Classroom 101",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const existingSessions = [{ _id: "existingSessionId" }];

      Timetable.find.mockResolvedValueOnce(existingSessions);

      await addClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Session overlaps with existing sessions",
      });
    });

    it("should return 500 if there is an error adding a class session", async () => {
      const req = {
        body: {
          courseID: "courseId",
          week: "1",
          day: "2024-03-25",
          startTime: "10:00",
          endTime: "12:00",
          facultyID: "facultyId",
          location: "Classroom 101",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Timetable.find.mockRejectedValueOnce(new Error("Database error"));

      await addClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateClassSession", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update a class session", async () => {
      const req = {
        params: { id: "sessionId" },
        body: {
          courseID: "courseId",
          week: "2",
          day: "2024-03-28",
          startTime: "14:00",
          endTime: "16:00",
          facultyID: "facultyId",
          location: "Classroom 102",
        },
      };
      const res = {
        json: jest.fn(),
      };

      const existingSession = { _id: "sessionId" };
      const updatedSession = { _id: "sessionId", ...req.body };

      Timetable.findById.mockResolvedValueOnce(existingSession);
      Timetable.find.mockResolvedValueOnce([]);
      Timetable.findByIdAndUpdate.mockResolvedValueOnce(updatedSession);

      await updateClassSession(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedSession);
    });

    it("should return 404 if session not found for updating", async () => {
      const req = {
        params: { id: "nonExistentId" },
        body: {
          courseID: "courseId",
          week: "2",
          day: "2024-03-28",
          startTime: "14:00",
          endTime: "16:00",
          facultyID: "facultyId",
          location: "Classroom 102",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Timetable.findById.mockResolvedValueOnce(null);

      await updateClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Session not found" });
    });

    it("should return 400 if updating results in overlapping sessions", async () => {
      const req = {
        params: { id: "sessionId" },
        body: {
          courseID: "courseId",
          week: "2",
          day: "2024-03-28",
          startTime: "14:00",
          endTime: "16:00",
          facultyID: "facultyId",
          location: "Classroom 102",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const existingSession = { _id: "sessionId" };
      const overlappingSessions = [{ _id: "overlappingSessionId" }];

      Timetable.findById.mockResolvedValueOnce(existingSession);
      Timetable.find.mockResolvedValueOnce(overlappingSessions);

      await updateClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Update results in overlapping sessions",
      });
    });

    it("should return 500 if there is an error updating a class session", async () => {
      const req = {
        params: { id: "sessionId" },
        body: {
          courseID: "courseId",
          week: "2",
          day: "2024-03-28",
          startTime: "14:00",
          endTime: "16:00",
          facultyID: "facultyId",
          location: "Classroom 102",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Timetable.findById.mockRejectedValueOnce(new Error("Database error"));

      await updateClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deleteClassSession", () => {
    it("should delete an existing class session", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const session = { _id: "sessionId", courseID: "courseId" };
      Timetable.findByIdAndDelete.mockResolvedValueOnce(session);
      Course.findById.mockResolvedValueOnce({
        courseName: "Mathematics",
      });
      Enrollment.find.mockResolvedValueOnce([
        { userID: "userId1" },
        { userID: "userId2" },
      ]);
      const expectedNotifications = [
        {
          userID: "userId1",
          message: "A class session for course Mathematics has been deleted",
        },
        {
          userID: "userId2",
          message: "A class session for course Mathematics has been deleted",
        },
      ];
      Notification.mockReturnValueOnce({
        insertMany: jest.fn().mockResolvedValueOnce(expectedNotifications),
      });

      await deleteClassSession(req, res);

      expect(Timetable.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: "session deleted" });
    });

    it("should return 404 if session to delete is not found", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "session not found" });
    });

    it("should return 500 if there is an error fetching course details", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findByIdAndDelete.mockResolvedValueOnce({});
      Course.findById.mockRejectedValueOnce(new Error("Database error"));

      await deleteClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });

    it("should return 500 if there is an error fetching enrolled users", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findByIdAndDelete.mockResolvedValueOnce({});
      Course.findById.mockResolvedValueOnce({});
      Enrollment.find.mockRejectedValueOnce(new Error("Database error"));

      await deleteClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getAllClassSessions", () => {
    it("should get all class sessions", async () => {
      const sessions = [
        { _id: "sessionId1", courseID: "courseId1" },
        { _id: "sessionId2", courseID: "courseId2" },
      ];
      const req = {};
      const res = {
        json: jest.fn(),
      };
      Timetable.find.mockResolvedValueOnce(sessions);

      await getAllClassSessions(req, res);

      expect(res.json).toHaveBeenCalledWith(sessions);
    });

    it("should return 500 if there is an error fetching class sessions", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.find.mockRejectedValueOnce(new Error("Database error"));

      await getAllClassSessions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getClassSessionById", () => {
    it("should get a class session by ID", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const session = { _id: "sessionId", courseID: "courseId" };
      const res = {
        json: jest.fn(),
      };
      Timetable.findById.mockResolvedValueOnce(session);

      await getClassSessionById(req, res);

      expect(Timetable.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(session);
    });

    it("should return 404 if session with given ID is not found", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findById.mockResolvedValueOnce(null);

      await getClassSessionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Session not found" });
    });

    it("should return 500 if there is an error fetching the session", async () => {
      const req = {
        params: {
          id: "sessionId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Timetable.findById.mockRejectedValueOnce(new Error("Database error"));

      await getClassSessionById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
