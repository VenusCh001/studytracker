const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// AI-based scheduling (mock implementation)
exports.generateSchedule = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Get all pending assignments
    const assignments = await Assignment.find({
      status: { $in: ['pending', 'in-progress'] }
    }).populate('course').sort({ dueDate: 1 });
    
    // Mock AI scheduling algorithm
    const schedule = [];
    const now = new Date();
    
    assignments.forEach((assignment, index) => {
      const daysUntilDue = Math.ceil((assignment.dueDate - now) / (1000 * 60 * 60 * 24));
      const estimatedHours = assignment.estimatedHours || 5;
      
      // Simple scheduling: divide work evenly
      const sessionsNeeded = Math.ceil(estimatedHours / 2); // 2-hour sessions
      
      for (let i = 0; i < sessionsNeeded; i++) {
        const sessionDate = new Date(now);
        sessionDate.setDate(sessionDate.getDate() + Math.floor((daysUntilDue / sessionsNeeded) * i));
        
        schedule.push({
          assignment: assignment._id,
          title: assignment.title,
          course: assignment.course ? assignment.course.name : 'N/A',
          date: sessionDate,
          duration: 2,
          priority: assignment.priority,
          type: 'study-session'
        });
      }
    });
    
    // Sort by date
    schedule.sort((a, b) => a.date - b.date);
    
    res.json({
      message: 'Schedule generated successfully',
      schedule: schedule.slice(0, 20), // Return next 20 sessions
      algorithmUsed: 'AI-based workload distribution',
      preferences: preferences || {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating schedule', error: error.message });
  }
};

// Get optimal study times
exports.getOptimalStudyTimes = async (req, res) => {
  try {
    // Mock AI recommendation based on typical student patterns
    const optimalTimes = [
      {
        timeSlot: '09:00-11:00',
        day: 'Weekdays',
        reason: 'High cognitive performance in morning hours',
        score: 95
      },
      {
        timeSlot: '14:00-16:00',
        day: 'Weekdays',
        reason: 'Good focus after lunch break',
        score: 85
      },
      {
        timeSlot: '19:00-21:00',
        day: 'Weekdays',
        reason: 'Evening study session for review',
        score: 80
      },
      {
        timeSlot: '10:00-14:00',
        day: 'Weekends',
        reason: 'Extended focus periods available',
        score: 90
      }
    ];
    
    res.json({
      optimalTimes,
      message: 'AI-analyzed optimal study times based on cognitive patterns'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting optimal times', error: error.message });
  }
};

// Smart task prioritization
exports.prioritizeTasks = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      status: { $in: ['pending', 'in-progress'] }
    }).populate('course');
    
    // Mock AI prioritization algorithm
    const prioritized = assignments.map(assignment => {
      const now = new Date();
      const daysUntilDue = Math.ceil((assignment.dueDate - now) / (1000 * 60 * 60 * 24));
      
      // Calculate urgency score
      let urgencyScore = 100;
      if (daysUntilDue < 1) urgencyScore = 100;
      else if (daysUntilDue < 3) urgencyScore = 90;
      else if (daysUntilDue < 7) urgencyScore = 70;
      else if (daysUntilDue < 14) urgencyScore = 50;
      else urgencyScore = 30;
      
      // Factor in priority
      const priorityWeight = {
        'urgent': 1.5,
        'high': 1.2,
        'medium': 1.0,
        'low': 0.8
      };
      
      const finalScore = urgencyScore * (priorityWeight[assignment.priority] || 1.0);
      
      return {
        assignment,
        score: finalScore,
        daysUntilDue,
        recommendation: urgencyScore > 80 ? 'Start immediately' : urgencyScore > 50 ? 'Schedule soon' : 'Plan ahead'
      };
    });
    
    // Sort by score
    prioritized.sort((a, b) => b.score - a.score);
    
    res.json({
      prioritizedTasks: prioritized,
      message: 'Tasks prioritized using AI algorithm'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error prioritizing tasks', error: error.message });
  }
};
