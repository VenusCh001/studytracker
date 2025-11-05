const Course = require('../models/Course');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Auto-fetch course details (mock implementation)
exports.autoFetchCourse = async (req, res) => {
  try {
    const { platform, courseId } = req.body;
    
    // Mock auto-fetch - in real implementation, this would call platform APIs
    const mockCourseData = {
      name: `Auto-fetched Course from ${platform}`,
      code: `${platform.toUpperCase()}-${courseId}`,
      professor: 'Auto-detected Professor',
      description: `This course was automatically fetched from ${platform}`,
      platform: platform,
      autoFetched: true,
      status: 'active'
    };
    
    const course = new Course(mockCourseData);
    await course.save();
    
    res.status(201).json({
      message: 'Course auto-fetched successfully',
      course
    });
  } catch (error) {
    res.status(400).json({ message: 'Error auto-fetching course', error: error.message });
  }
};
