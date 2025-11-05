const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// All task routes require authentication
router.use(authMiddleware);

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    const filter = { userId: req.userId };

    // Validate query parameters against allowed values (prevents NoSQL injection)
    // Only whitelisted values are added to the filter
    const validStatuses = ['pending', 'in-progress', 'completed', 'overdue'];
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const validTypes = ['assignment', 'research', 'project', 'online-course', 'general'];

    if (status && validStatuses.includes(status)) {
      filter.status = status;
    }
    if (priority && validPriorities.includes(priority)) {
      filter.priority = priority;
    }
    if (type && validTypes.includes(type)) {
      filter.type = type;
    }

    // Safe to use: filter values are validated against whitelists
    const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks', message: error.message });
  }
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task', message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.userId
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task', message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task', message: error.message });
  }
});

// Update task progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.progress = progress;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error updating task progress:', error);
    res.status(500).json({ error: 'Failed to update task progress', message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task', message: error.message });
  }
});

module.exports = router;
