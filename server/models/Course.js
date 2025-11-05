const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  professor: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    min: 0
  },
  schedule: {
    days: [String],
    time: String,
    location: String
  },
  description: String,
  semester: String,
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  color: {
    type: String,
    default: '#3B82F6'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  autoFetched: {
    type: Boolean,
    default: false
  },
  platform: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
