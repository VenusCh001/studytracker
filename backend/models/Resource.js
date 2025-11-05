const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['note', 'link', 'file', 'reference', 'document'],
    required: true
  },
  content: {
    type: String // For notes or text content
  },
  url: {
    type: String // For external links
  },
  fileInfo: {
    filename: String,
    fileSize: Number,
    mimeType: String,
    fileUrl: String
  },
  tags: [String],
  category: {
    type: String,
    enum: ['lecture-notes', 'reading-material', 'video', 'article', 'book', 'other'],
    default: 'other'
  },
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  relatedTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  isFavorite: {
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

// Update timestamp on save
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
resourceSchema.index({ userId: 1, type: 1 });
resourceSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
