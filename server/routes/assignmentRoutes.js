const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAllAssignments);
router.get('/upcoming', assignmentController.getUpcomingAssignments);
router.get('/overdue', assignmentController.getOverdueAssignments);
router.get('/:id', assignmentController.getAssignment);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.put('/:id/progress', assignmentController.updateProgress);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;
