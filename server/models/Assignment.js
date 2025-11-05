const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  description: String,
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimatedHours: Number,
  actualHours: Number,
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  reminders: [{
    datetime: Date,
    sent: Boolean,
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

assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Auto-update status based on progress and due date
  if (this.progress === 100) {
    this.status = 'completed';
  } else if (this.dueDate < new Date() && this.status !== 'completed') {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
