const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// Middleware for authenticating users
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Extracting email and password from request body

    // Finding user by email
    const user = await User.findOne({ email });

    // Checking if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generating token for authenticated user
      generateToken(res, user._id);

      // Sending user information in response
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// Middleware for registering new users
const registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userExists = await User.findOne({ email }); // Checking if user already exists
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      // Creating new user
      name,
      email,
      mobile,
      password,
    });

    if (user) {
      generateToken(res, user._id); // Generating token for new user

      // Sending user information in response
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error); // Forwarding error to error handling middleware
  }
};

// Middleware for logging out user
const logoutUser = async (req, res) => {
  res.clearCookie("jwt"); // Clearing JWT cookie
  res.status(200).json({ message: "User logged out" });
};

// Middleware for getting user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id); // Finding user by ID

    if (user) {
      res.status(200).json(user); // Sending user profile in response
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// Middleware for getting all user profiles
const getAllProfiles = async (req, res, next) => {
  try {
    const users = await User.find({}); // Finding all users
    res.json(users); // Sending all user profiles in response
  } catch (error) {
    next(error);
  }
};

// Middleware for updating user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id); // Finding user by ID

    if (user) {
      // Updating user data
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      if (req.body.password) {
        user.password = req.body.password; // Updating password if provided
      }

      const updatedUser = await user.save(); // Saving updated user data

      // Sending updated user profile in response
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// Middleware for updating user role by ID
const updateUserRoleById = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extracting user ID from request parameters
    const { role } = req.body; // Extracting new role from request body

    const user = await User.findById(userId); // Finding user by ID

    if (user) {
      user.role = role; // Updating user's role

      const updatedUser = await user.save(); // Saving updated user data

      // Sending updated user profile in response
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role, // Including updated role in response
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// Middleware for deleting user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extracting user ID from request parameters

    const user = await User.findById(userId); // Finding user by ID

    if (user) {
      await User.deleteOne({ _id: userId }); // Deleting user
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getAllProfiles,
  updateUserProfile,
  deleteUserById,
  updateUserRoleById,
};
