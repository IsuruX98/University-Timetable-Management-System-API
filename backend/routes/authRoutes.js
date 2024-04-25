const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  getAllProfiles,
  updateUserProfile,
  deleteUserById,
  updateUserRoleById,
} = require("../controllers/authController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Route to authenticate a user
router.post("/auth", authUser);

// Route to register a new user
router.post("/register", registerUser);

// Route to logout a user
router.post("/logout", logoutUser);

// Route to get user profile
router.get("/profile", protect, getUserProfile);

// Route to get all profiles (Only accessible to admins)
router.get("/allProfiles", protect, checkRole(["admin"]), getAllProfiles);

// Route to update user profile
router.put("/profile", protect, updateUserProfile);

// Route to delete user by ID
router.delete("/profile/:id", protect, deleteUserById);

// Route to update user role by ID
router.put("/update-role/:id", protect, updateUserRoleById);

module.exports = router;
