const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    tasksCompleted: {
      type: Number,
      default: 0
    },
    studyTime: {
      type: Number, // in minutes
      default: 0
    },
    coursesCompleted: {
      type: Number,
      default: 0
    },
    modulesCompleted: {
      type: Number,
      default: 0
    }
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    }
  },
  focus: {
    pomodoroSessions: {
      type: Number,
      default: 0
    },
    totalFocusTime: {
      type: Number, // in minutes
      default: 0
    }
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'neutral', 'tired', 'stressed'],
    default: 'neutral'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one progress entry per user per day
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

// Helper method to get or create today's progress
progressSchema.statics.getTodayProgress = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let progress = await this.findOne({ userId, date: today });
  
  if (!progress) {
    progress = await this.create({ userId, date: today });
  }
  
  return progress;
};

module.exports = mongoose.model('Progress', progressSchema);
