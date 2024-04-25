const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route for creating a resource
router.post(
  "/",
  protect,
  checkRole(["admin", "faculty"]),
  resourceController.createResource
);

// Route for updating a resource
router.put(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  resourceController.updateResource
);

// Route for deleting a resource
router.delete(
  "/:id",
  protect,
  checkRole(["admin", "faculty"]),
  resourceController.deleteResource
);

// Route for getting all resources
router.get("/", resourceController.getAllResources);

// Route for getting a resource by ID
router.get("/:id", resourceController.getResourceById);

module.exports = router;
