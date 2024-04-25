const Faculty = require("../models/facultyModel");

// Controller function to create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const faculty = new Faculty({ name });
    const savedFaculty = await faculty.save();
    res.status(201).json(savedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json({ message: "Faculty deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
