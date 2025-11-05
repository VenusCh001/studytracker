const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Task = require('../models/Task');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// All progress routes require authentication
router.use(authMiddleware);

// Get today's progress
router.get('/today', async (req, res) => {
  try {
    const progress = await Progress.getTodayProgress(req.userId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching today\'s progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress', message: error.message });
  }
});

// Get progress for a date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const progress = await Progress.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress range:', error);
    res.status(500).json({ error: 'Failed to fetch progress', message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get overall statistics
    const totalTasks = await Task.countDocuments({ userId: req.userId });
    const completedTasks = await Task.countDocuments({ userId: req.userId, status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ userId: req.userId, status: 'in-progress' });
    const overdueTasks = await Task.countDocuments({ userId: req.userId, status: 'overdue' });

    const totalCourses = await Course.countDocuments({ userId: req.userId });
    const completedCourses = await Course.countDocuments({ userId: req.userId, status: 'completed' });
    const inProgressCourses = await Course.countDocuments({ userId: req.userId, status: 'in-progress' });

    // Get recent progress (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProgress = await Progress.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    if (recentProgress.length > 0) {
      currentStreak = recentProgress[0].streak?.current || 0;
      longestStreak = Math.max(...recentProgress.map(p => p.streak?.longest || 0));
    }

    // Calculate total study time (last 30 days)
    const totalStudyTime = recentProgress.reduce((sum, p) => sum + (p.metrics?.studyTime || 0), 0);

    res.json({
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      courses: {
        total: totalCourses,
        completed: completedCourses,
        inProgress: inProgressCourses,
        completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      studyTime: {
        last30Days: totalStudyTime,
        average: recentProgress.length > 0 ? Math.round(totalStudyTime / recentProgress.length) : 0
      },
      recentActivity: recentProgress.slice(0, 7)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

// Update today's progress
router.post('/update', async (req, res) => {
  try {
    const progress = await Progress.getTodayProgress(req.userId);

    // Update metrics
    if (req.body.metrics) {
      Object.keys(req.body.metrics).forEach(key => {
        if (progress.metrics[key] !== undefined) {
          progress.metrics[key] = req.body.metrics[key];
        }
      });
    }

    // Update streak
    if (req.body.streak) {
      Object.keys(req.body.streak).forEach(key => {
        if (progress.streak[key] !== undefined) {
          progress.streak[key] = req.body.streak[key];
        }
      });
    }

    // Update focus
    if (req.body.focus) {
      Object.keys(req.body.focus).forEach(key => {
        if (progress.focus[key] !== undefined) {
          progress.focus[key] = req.body.focus[key];
        }
      });
    }

    // Update mood
    if (req.body.mood) {
      progress.mood = req.body.mood;
    }

    // Update notes
    if (req.body.notes) {
      progress.notes = req.body.notes;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress', message: error.message });
  }
});

module.exports = router;
