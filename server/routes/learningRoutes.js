const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.get('/', learningController.getAllResources);
router.get('/:id', learningController.getResource);
router.post('/', learningController.createResource);
router.put('/:id', learningController.updateResource);
router.put('/:id/progress', learningController.updateProgress);
router.delete('/:id', learningController.deleteResource);
router.post('/auto-fetch', learningController.autoFetchFromPlatform);

module.exports = router;
