const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route to enroll user to course (accessible to student)
router.post(
  "/enroll",
  protect,
  checkRole(["student"]),
  enrollmentController.enrollUser
);

// Route to unenroll user from course (accessible to student)
router.post(
  "/unenroll",
  protect,
  checkRole(["student"]),
  enrollmentController.unenrollUser
);

// Route to get all enrollments (accessible to admin and faculty)
router.get(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  enrollmentController.getAllEnrollments
);

// Route to get enrollment by ID
router.get("/:enrollmentId", protect, enrollmentController.getEnrollmentById);

// Route to get enrollments by user ID
router.get(
  "/user/:userId",
  protect,
  enrollmentController.getEnrollmentsByUserId
);

module.exports = router;
