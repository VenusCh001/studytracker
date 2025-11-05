const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['coursera', 'udemy', 'edx', 'youtube', 'khan-academy', 'linkedin-learning', 'other'],
    required: true
  },
  url: String,
  type: {
    type: String,
    enum: ['video', 'course', 'article', 'tutorial', 'documentation'],
    default: 'course'
  },
  category: String,
  duration: String,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: String,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  startDate: Date,
  completedDate: Date,
  tags: [String],
  autoFetched: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

learningResourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.progress === 100) {
    this.completed = true;
    if (!this.completedDate) {
      this.completedDate = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('LearningResource', learningResourceSchema);
