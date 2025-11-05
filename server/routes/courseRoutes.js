const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { strictLimiter, autoFetchLimiter } = require('../middleware/rateLimiter');
const { courseValidation } = require('../middleware/validation');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.post('/', strictLimiter, courseValidation, courseController.createCourse);
router.put('/:id', strictLimiter, courseValidation, courseController.updateCourse);
router.delete('/:id', strictLimiter, courseController.deleteCourse);
router.post('/auto-fetch', autoFetchLimiter, courseController.autoFetchCourse);

module.exports = router;
