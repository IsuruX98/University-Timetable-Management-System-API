const Timetable = require("../models/timetableModel");
const Notification = require("../models/notificationModel");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");

// Controller for adding a class session
async function addClassSession(req, res) {
  try {
    const { courseID, week, day, startTime, endTime, facultyID, location } =
      req.body;

    // Check for overlapping sessions
    const existingSessions = await Timetable.find({
      courseID,
      week,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } }, // New session starts before existing session ends
            { endTime: { $gt: startTime } }, // New session ends after existing session starts
          ],
        },
      ],
    });

    if (existingSessions.length > 0) {
      return res
        .status(400)
        .json({ message: "Session overlaps with existing sessions" });
    }

    const newSession = new Timetable({
      courseID,
      week,
      day,
      startTime,
      endTime,
      facultyID,
      location,
    });
    const savedSession = await newSession.save();

    // Fetch course details
    const course = await Course.findById(courseID);

    // Fetch enrolled users for the course
    const enrolledUsers = await Enrollment.find({ courseID });

    // Create notifications for each enrolled user
    const notifications = enrolledUsers.map((enrollment) => {
      return new Notification({
        userID: enrollment.userID,
        message: `A new class session has been added for course ${course.courseName}`,
      });
    });

    // Save notifications to database
    await Notification.insertMany(notifications);

    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for updating a class session
async function updateClassSession(req, res) {
  try {
    const { id } = req.params;
    const { courseID, week, day, startTime, endTime, facultyID, location } =
      req.body;

    // Fetch the existing session
    const existingSession = await Timetable.findById(id);

    if (!existingSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check for overlapping sessions excluding the current session being updated
    const overlappingSessions = await Timetable.find({
      _id: { $ne: id }, // Exclude the current session being updated
      courseID,
      week,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } }, // New session starts before existing session ends
            { endTime: { $gt: startTime } }, // New session ends after existing session starts
          ],
        },
      ],
    });

    if (overlappingSessions.length > 0) {
      return res
        .status(400)
        .json({ message: "Update results in overlapping sessions" });
    }

    // Update the session
    const updatedSession = await Timetable.findByIdAndUpdate(
      id,
      { courseID, week, day, startTime, endTime, facultyID, location },
      { new: true }
    );

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for deleting a class session
async function deleteClassSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Timetable.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ message: "session not found" });
    }

    // Fetch course details
    const course = await Course.findById(session.courseID);

    // Fetch enrolled users for the course
    const enrolledUsers = await Enrollment.find({ courseID: session.courseID });

    // Create notifications for each enrolled user
    const notifications = enrolledUsers.map((enrollment) => {
      return new Notification({
        userID: enrollment.userID,
        message: `A class session for course ${course.courseName} has been deleted`,
      });
    });

    // Save notifications to database
    await Notification.insertMany(notifications);

    res.json({ message: "session deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all class sessions
async function getAllClassSessions(req, res) {
  try {
    const sessions = await Timetable.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting a class session by ID
async function getClassSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Timetable.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all sessions by course ID, week, month, and year
async function getAllSessionsByCourseIDWeekMonthYear(req, res) {
  try {
    const { courseID, week, month, year } = req.params;

    // Convert numeric month to month name
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[parseInt(month) - 1];

    // Fetch course name
    const course = await Course.findById(courseID);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Filter sessions by courseID and week
    let sessions = await Timetable.find({ courseID, week });

    // Filter sessions by month and year
    sessions = sessions.filter((session) => {
      const sessionDate = new Date(session.day);
      return (
        sessionDate.getMonth() + 1 === parseInt(month) &&
        sessionDate.getFullYear() === parseInt(year)
      );
    });

    // Create response message
    const message = `Showing timetable for course: ${course.courseName}, year: ${year}, month: ${monthName}, week: ${week}`;

    res.json({ message, sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addClassSession,
  updateClassSession,
  deleteClassSession,
  getAllClassSessions,
  getClassSessionById,
  getAllSessionsByCourseIDWeekMonthYear,
};
