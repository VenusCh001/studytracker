const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/generate', scheduleController.generateSchedule);
router.get('/optimal-times', scheduleController.getOptimalStudyTimes);
router.get('/prioritize', scheduleController.prioritizeTasks);

module.exports = router;
