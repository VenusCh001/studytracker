const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { strictLimiter } = require('../middleware/rateLimiter');
const { projectValidation } = require('../middleware/validation');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);
router.post('/', strictLimiter, projectValidation, projectController.createProject);
router.put('/:id', strictLimiter, projectValidation, projectController.updateProject);
router.delete('/:id', strictLimiter, projectController.deleteProject);

module.exports = router;
