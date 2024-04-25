const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route to create a new course (accessible to admin and faculty)
router.post(
  "/",
  protect,
  checkRole(["faculty", "admin"]),
  courseController.createCourse
);

// Route to assign faculty to a course (accessible only to admins)
router.post(
  "/:id/assign-faculty",
  protect,
  checkRole(["admin"]),
  courseController.assignFacultyToCourse
);

// Route to get all courses (accessible to faculty and student)
router.get("/", protect, courseController.getAllCourses);

// Route to get a course by ID (accessible to faculty and student)
router.get("/:id", protect, courseController.getCourseById);

// Route to update a course (accessible to faculty)
router.put(
  "/:id",
  protect,
  checkRole(["faculty"]),
  courseController.updateCourse
);

// Route to delete a course (accessible to faculty)
router.delete(
  "/:id",
  protect,
  checkRole(["faculty"]),
  courseController.deleteCourse
);

module.exports = router;
