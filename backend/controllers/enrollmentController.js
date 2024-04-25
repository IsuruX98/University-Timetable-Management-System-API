const Enrollment = require("../models/enrollmentModel");

// Controller for enrolling a user in a course
async function enrollUser(req, res) {
  try {
    const { userID, courseID } = req.body;

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userID, courseID });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in the course" });
    }

    const newEnrollment = new Enrollment({
      userID,
      courseID,
    });
    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for unenrolling a user from a course
async function unenrollUser(req, res) {
  try {
    const { userID, courseID } = req.body;
    const enrollment = await Enrollment.findOneAndDelete({ userID, courseID });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "User unenrolled from the course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting enrollments by user ID
async function getEnrollmentsByUserId(req, res) {
  try {
    const { userId } = req.params;

    // Find all enrollments for the specified user ID
    const enrollments = await Enrollment.find({ userID: userId });

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for the user" });
    }

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting an enrollment by ID
async function getEnrollmentById(req, res) {
  try {
    const { enrollmentId } = req.params;

    // Find the enrollment by ID
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all enrollments
async function getAllEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  enrollUser,
  unenrollUser,
  getAllEnrollments,
  getEnrollmentsByUserId,
  getEnrollmentById,
};
