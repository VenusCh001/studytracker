const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Course validation rules
const courseValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 200 }).escape(),
  body('code').optional().trim().isLength({ min: 1, max: 50 }).escape(),
  body('professor').optional().trim().isLength({ max: 100 }).escape(),
  body('credits').optional().isInt({ min: 0, max: 20 }),
  body('semester').optional().trim().isLength({ max: 50 }).escape(),
  body('description').optional().trim().escape(),
  body('status').optional().isIn(['active', 'completed', 'dropped']),
  checkValidation
];

// Assignment validation rules
const assignmentValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
  body('description').optional().trim().escape(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'overdue']),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('actualHours').optional().isFloat({ min: 0 }),
  checkValidation
];

// Project validation rules
const projectValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
  body('description').optional().trim().escape(),
  body('type').optional().isIn(['research', 'course-project', 'personal', 'group']),
  body('status').optional().isIn(['planning', 'in-progress', 'review', 'completed', 'on-hold']),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  checkValidation
];

// Learning resource validation rules
const learningValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
  body('platform').optional().isIn(['coursera', 'udemy', 'edx', 'youtube', 'khan-academy', 'linkedin-learning', 'other']),
  body('type').optional().isIn(['video', 'course', 'article', 'tutorial', 'documentation']),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  checkValidation
];

module.exports = {
  courseValidation,
  assignmentValidation,
  projectValidation,
  learningValidation
};
