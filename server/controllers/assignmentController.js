const Assignment = require('../models/Assignment');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Get single assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    await assignment.populate('course');
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating assignment', error: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { progress },
      { new: true, runValidators: true }
    ).populate('course');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating progress', error: error.message });
  }
};

// Get upcoming assignments
exports.getUpcomingAssignments = async (req, res) => {
  try {
    const now = new Date();
    const assignments = await Assignment.find({
      dueDate: { $gte: now },
      status: { $ne: 'completed' }
    })
      .populate('course')
      .sort({ dueDate: 1 })
      .limit(10);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming assignments', error: error.message });
  }
};

// Get overdue assignments
exports.getOverdueAssignments = async (req, res) => {
  try {
    const now = new Date();
    const assignments = await Assignment.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    })
      .populate('course')
      .sort({ dueDate: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overdue assignments', error: error.message });
  }
};
