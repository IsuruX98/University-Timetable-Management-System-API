const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route to create a new faculty
router.post(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  facultyController.createFaculty
);

// Route to get all faculties
router.get(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  facultyController.getAllFaculties
);

// Route to get a faculty by ID
router.get(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),

  facultyController.getFacultyById
);

// Route to update a faculty
router.put(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  facultyController.updateFaculty
);

// Route to delete a faculty
router.delete(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  facultyController.deleteFaculty
);

module.exports = router;
