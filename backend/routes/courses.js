const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// All course routes require authentication
router.use(authMiddleware);

// Get all courses for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, platform } = req.query;
    const filter = { userId: req.userId };

    // Validate query parameters against allowed values (prevents NoSQL injection)
    // Only whitelisted values are added to the filter
    const validStatuses = ['not-started', 'in-progress', 'completed', 'paused'];
    const validPlatforms = ['youtube', 'udemy', 'coursera', 'edx', 'geeksforgeeks', 'custom', 'other'];

    if (status && validStatuses.includes(status)) {
      filter.status = status;
    }
    if (platform && validPlatforms.includes(platform)) {
      filter.platform = platform;
    }

    // Safe to use: filter values are validated against whitelists
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses', message: error.message });
  }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course', message: error.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      userId: req.userId
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course', message: error.message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      course[key] = req.body[key];
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course', message: error.message });
  }
});

// Update module completion status
router.patch('/:id/modules/:moduleIndex/complete', async (req, res) => {
  try {
    const { completed } = req.body;
    const course = await Course.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    if (!course.modules[moduleIndex]) {
      return res.status(404).json({ error: 'Module not found' });
    }

    course.modules[moduleIndex].completed = completed !== undefined ? completed : true;
    await course.save();

    res.json(course);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ error: 'Failed to update module', message: error.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course', message: error.message });
  }
});

module.exports = router;
