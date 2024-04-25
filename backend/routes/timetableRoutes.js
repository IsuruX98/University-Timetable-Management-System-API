const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route for getting all class sessions
router.get("/", timetableController.getAllClassSessions);

// Route for getting a class session by ID
router.get("/:id", timetableController.getClassSessionById);

// Route for adding a class session
router.post(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  timetableController.addClassSession
);

// Route for updating a class session
router.put(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  timetableController.updateClassSession
);

// Route for deleting a class session
router.delete(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  timetableController.deleteClassSession
);

// Route for getting all sessions by course ID, week, month, and year
router.get(
  "/course/:courseID/week/:week/month/:month/year/:year",
  timetableController.getAllSessionsByCourseIDWeekMonthYear
);

module.exports = router;
