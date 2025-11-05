const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['research', 'course-project', 'personal', 'group'],
    default: 'course-project'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  description: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'review', 'completed', 'on-hold'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    dueDate: Date,
    completed: Boolean,
    description: String
  }],
  teamMembers: [{
    name: String,
    role: String,
    email: String
  }],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
