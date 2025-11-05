const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Project = require('../models/Project');
const LearningResource = require('../models/LearningResource');
const { mockCourses, mockAssignments, mockProjects, mockLearningResources } = require('../config/mockData');
const mongoose = require('mongoose');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get dashboard overview
exports.getDashboard = async (req, res) => {
  try {
    // If MongoDB is not connected, return mock data
    if (!isMongoConnected()) {
      const mockDashboard = {
        overview: {
          totalCourses: mockCourses.length,
          activeCourses: mockCourses.filter(c => c.status === 'active').length,
          totalAssignments: mockAssignments.length,
          pendingAssignments: mockAssignments.filter(a => a.status === 'pending' || a.status === 'in-progress').length,
          completedAssignments: mockAssignments.filter(a => a.status === 'completed').length,
          overdueAssignments: 0,
          totalProjects: mockProjects.length,
          activeProjects: mockProjects.filter(p => p.status === 'in-progress').length,
          learningResources: mockLearningResources.length,
          completedLearning: mockLearningResources.filter(l => l.completed).length,
          completionRate: Math.round((1 / mockAssignments.length) * 100)
        },
        upcomingDeadlines: mockAssignments.filter(a => a.status !== 'completed').slice(0, 5),
        recentActivity: mockAssignments.slice(0, 5),
        progressByCourse: mockCourses.map(course => ({
          course: course.name,
          completed: 1,
          total: 3,
          percentage: 33
        })),
        timestamp: new Date(),
        demoMode: true,
        message: 'Demo mode: Install MongoDB for full functionality'
      };
      return res.json(mockDashboard);
    }
    
    const now = new Date();
    
    // Get counts and statistics
    const [
      totalCourses,
      activeCourses,
      totalAssignments,
      pendingAssignments,
      completedAssignments,
      overdueAssignments,
      totalProjects,
      activeProjects,
      learningResources,
      completedLearning
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: 'active' }),
      Assignment.countDocuments(),
      Assignment.countDocuments({ status: { $in: ['pending', 'in-progress'] } }),
      Assignment.countDocuments({ status: 'completed' }),
      Assignment.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'completed' } }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'in-progress' }),
      LearningResource.countDocuments(),
      LearningResource.countDocuments({ completed: true })
    ]);
    
    // Get upcoming deadlines
    const upcomingDeadlines = await Assignment.find({
      dueDate: { $gte: now },
      status: { $ne: 'completed' }
    })
      .populate('course')
      .sort({ dueDate: 1 })
      .limit(5);
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = await Assignment.find({
      updatedAt: { $gte: sevenDaysAgo }
    })
      .populate('course')
      .sort({ updatedAt: -1 })
      .limit(10);
    
    // Calculate productivity metrics
    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;
    
    // Get progress by course
    const courses = await Course.find({ status: 'active' });
    const progressByCourse = await Promise.all(
      courses.map(async (course) => {
        const courseAssignments = await Assignment.find({ course: course._id });
        const completed = courseAssignments.filter(a => a.status === 'completed').length;
        const total = courseAssignments.length;
        
        return {
          course: course.name,
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      })
    );
    
    res.json({
      overview: {
        totalCourses,
        activeCourses,
        totalAssignments,
        pendingAssignments,
        completedAssignments,
        overdueAssignments,
        totalProjects,
        activeProjects,
        learningResources,
        completedLearning,
        completionRate
      },
      upcomingDeadlines,
      recentActivity,
      progressByCourse,
      timestamp: now
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get assignments completed in last 30 days
    const completedLast30Days = await Assignment.countDocuments({
      status: 'completed',
      updatedAt: { $gte: thirtyDaysAgo }
    });
    
    // Get time tracking data
    const assignments = await Assignment.find({
      actualHours: { $exists: true, $ne: null }
    });
    
    const totalPlannedHours = assignments.reduce((sum, a) => sum + (a.estimatedHours || 0), 0);
    const totalActualHours = assignments.reduce((sum, a) => sum + (a.actualHours || 0), 0);
    
    // Learning progress
    const learningProgress = await LearningResource.aggregate([
      {
        $group: {
          _id: '$platform',
          averageProgress: { $avg: '$progress' },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      completedLast30Days,
      timeTracking: {
        totalPlannedHours,
        totalActualHours,
        efficiency: totalPlannedHours > 0 
          ? Math.round((totalPlannedHours / totalActualHours) * 100)
          : 100
      },
      learningProgress,
      timestamp: now
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
