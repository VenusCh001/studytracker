const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { strictLimiter } = require('../middleware/rateLimiter');
const { assignmentValidation } = require('../middleware/validation');

router.get('/', assignmentController.getAllAssignments);
router.get('/upcoming', assignmentController.getUpcomingAssignments);
router.get('/overdue', assignmentController.getOverdueAssignments);
router.get('/:id', assignmentController.getAssignment);
router.post('/', strictLimiter, assignmentValidation, assignmentController.createAssignment);
router.put('/:id', strictLimiter, assignmentValidation, assignmentController.updateAssignment);
router.put('/:id/progress', strictLimiter, assignmentController.updateProgress);
router.delete('/:id', strictLimiter, assignmentController.deleteAssignment);

module.exports = router;
