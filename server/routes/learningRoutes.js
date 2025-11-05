const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const { strictLimiter, autoFetchLimiter } = require('../middleware/rateLimiter');
const { learningValidation } = require('../middleware/validation');

router.get('/', learningController.getAllResources);
router.get('/:id', learningController.getResource);
router.post('/', strictLimiter, learningValidation, learningController.createResource);
router.put('/:id', strictLimiter, learningValidation, learningController.updateResource);
router.put('/:id/progress', strictLimiter, learningController.updateProgress);
router.delete('/:id', strictLimiter, learningController.deleteResource);
router.post('/auto-fetch', autoFetchLimiter, learningController.autoFetchFromPlatform);

module.exports = router;
