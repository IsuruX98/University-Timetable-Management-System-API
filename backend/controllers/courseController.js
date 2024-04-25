const Course = require("../models/courseModel");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, code, description, credits } = req.body;
    // Do not include facultyID when creating a course
    const course = new Course({
      courseName,
      code,
      description,
      credits,
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Assign faculty to a course
exports.assignFacultyToCourse = async (req, res) => {
  try {
    const { facultyID } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course with the faculty ID
    course.facultyID = facultyID;
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, code, description, credits } = req.body;
    const courseUpdates = {
      courseName,
      code,
      description,
      credits,
    };
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      // Exclude facultyID from the update
      { $set: courseUpdates },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
