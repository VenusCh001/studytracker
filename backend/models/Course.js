const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    enum: ['youtube', 'udemy', 'coursera', 'edx', 'geeksforgeeks', 'custom', 'other'],
    default: 'custom'
  },
  url: {
    type: String,
    trim: true
  },
  instructor: {
    type: String,
    trim: true
  },
  duration: {
    total: Number, // in minutes
    completed: {
      type: Number,
      default: 0
    }
  },
  modules: [{
    title: String,
    duration: Number,
    completed: {
      type: Boolean,
      default: false
    },
    order: Number
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'paused'],
    default: 'not-started'
  },
  startDate: Date,
  targetCompletionDate: Date,
  completedAt: Date,
  tags: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp and progress on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate progress based on completed modules
  if (this.modules && this.modules.length > 0) {
    const completedModules = this.modules.filter(m => m.completed).length;
    this.progress = Math.round((completedModules / this.modules.length) * 100);
  }
  
  // Update status based on progress
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = Date.now();
  } else if (this.progress > 0 && this.progress < 100 && this.status === 'not-started') {
    this.status = 'in-progress';
  }
  
  next();
});

// Index for efficient queries
courseSchema.index({ userId: 1, status: 1 });
courseSchema.index({ userId: 1, platform: 1 });

module.exports = mongoose.model('Course', courseSchema);
