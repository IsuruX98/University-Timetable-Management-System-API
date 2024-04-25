const Course = require("../models/courseModel");
const courseController = require("../controllers/courseController");

jest.mock("../models/courseModel");

describe("Course Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for createCourse function
  describe("createCourse", () => {
    it("should create a new course", async () => {
      const req = {
        body: {
          courseName: "Course 101",
          code: "CS101",
          description: "Introduction to Computer Science",
          credits: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedSavedCourse = {
        _id: "someId",
        courseName: "Course 101",
        code: "CS101",
        description: "Introduction to Computer Science",
        credits: 3,
      };
      Course.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(expectedSavedCourse),
      });

      await courseController.createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedSavedCourse);
      expect(Course).toHaveBeenCalledWith({
        courseName: "Course 101",
        code: "CS101",
        description: "Introduction to Computer Science",
        credits: 3,
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
      Course.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error("Database error")),
      });

      await courseController.createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  // Test for getAllCourses function
  describe("getAllCourses", () => {
    it("should get all courses", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const courses = [
        {
          _id: "course1",
          courseName: "Course 1",
          code: "CS101",
          description: "Introduction to Computer Science",
          credits: 3,
        },
        {
          _id: "course2",
          courseName: "Course 2",
          code: "CS102",
          description: "Advanced Computer Science",
          credits: 4,
        },
      ];
      Course.find.mockResolvedValueOnce(courses);

      await courseController.getAllCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(courses);
      expect(Course.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.find.mockRejectedValueOnce(new Error("Database error"));

      await courseController.getAllCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  // Test for getCourseById function
  describe("getCourseById", () => {
    it("should get a course by ID", async () => {
      const req = {
        params: {
          id: "courseId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const course = {
        _id: "courseId",
        courseName: "Course 101",
        code: "CS101",
        description: "Introduction to Computer Science",
        credits: 3,
      };
      Course.findById.mockResolvedValueOnce(course);

      await courseController.getCourseById(req, res);

      expect(res.json).toHaveBeenCalledWith(course);
      expect(Course.findById).toHaveBeenCalledWith("courseId");
    });

    it("should handle course not found", async () => {
      const req = {
        params: {
          id: "nonexistentCourseId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findById.mockResolvedValueOnce(null);

      await courseController.getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "courseId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findById.mockRejectedValueOnce(new Error("Database error"));

      await courseController.getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  // Test for updateCourse function
  describe("updateCourse", () => {
    it("should update a course by ID", async () => {
      const req = {
        params: {
          id: "courseId",
        },
        body: {
          courseName: "Updated Course",
          code: "CS102",
          description: "Advanced Computer Science",
          credits: 4,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const updatedCourse = {
        _id: "courseId",
        courseName: "Updated Course",
        code: "CS102",
        description: "Advanced Computer Science",
        credits: 4,
      };
      Course.findByIdAndUpdate.mockResolvedValueOnce(updatedCourse);

      await courseController.updateCourse(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedCourse);
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        "courseId",
        {
          $set: {
            courseName: "Updated Course",
            code: "CS102",
            description: "Advanced Computer Science",
            credits: 4,
          },
        },
        { new: true }
      );
    });

    it("should handle course not found", async () => {
      const req = {
        params: {
          id: "nonexistentCourseId",
        },
        body: {
          courseName: "Updated Course",
          code: "CS102",
          description: "Advanced Computer Science",
          credits: 4,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findByIdAndUpdate.mockResolvedValueOnce(null);

      await courseController.updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "courseId",
        },
        body: {
          courseName: "Updated Course",
          code: "CS102",
          description: "Advanced Computer Science",
          credits: 4,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database error")
      );

      await courseController.updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  // Test for deleteCourse function
  describe("deleteCourse", () => {
    it("should delete a course by ID", async () => {
      const req = {
        params: {
          id: "courseId",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const deletedCourse = {
        _id: "courseId",
        courseName: "Deleted Course",
        code: "CS101",
        description: "Introduction to Computer Science",
        credits: 3,
      };
      Course.findByIdAndDelete.mockResolvedValueOnce(deletedCourse);

      await courseController.deleteCourse(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Course deleted" });
      expect(Course.findByIdAndDelete).toHaveBeenCalledWith("courseId");
    });

    it("should handle course not found", async () => {
      const req = {
        params: {
          id: "nonexistentCourseId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findByIdAndDelete.mockResolvedValueOnce(null);

      await courseController.deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "courseId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Course.findByIdAndDelete.mockRejectedValueOnce(
        new Error("Database error")
      );

      await courseController.deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
