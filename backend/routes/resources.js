const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

// All resource routes require authentication
router.use(authMiddleware);

// Get all resources for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { type, category, tags } = req.query;
    const filter = { userId: req.userId };

    // Validate query parameters against allowed values (prevents NoSQL injection)
    // Only whitelisted values are added to the filter
    const validTypes = ['note', 'link', 'file', 'reference', 'document'];
    const validCategories = ['lecture-notes', 'reading-material', 'video', 'article', 'book', 'other'];

    if (type && validTypes.includes(type)) {
      filter.type = type;
    }
    if (category && validCategories.includes(category)) {
      filter.category = category;
    }
    if (tags && typeof tags === 'string') {
      // Sanitize tags - only allow alphanumeric, hyphens, and underscores
      const sanitizedTags = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => /^[a-zA-Z0-9_-]+$/.test(tag));
      if (sanitizedTags.length > 0) {
        filter.tags = { $in: sanitizedTags };
      }
    }

    // Safe to use: filter values are validated against whitelists and regex patterns
    const resources = await Resource.find(filter)
      .populate('relatedCourse', 'title')
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources', message: error.message });
  }
});

// Get a single resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.userId })
      .populate('relatedCourse', 'title')
      .populate('relatedTask', 'title');
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource', message: error.message });
  }
});

// Create a new resource
router.post('/', async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      userId: req.userId
    };

    const resource = new Resource(resourceData);
    await resource.save();

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource', message: error.message });
  }
});

// Update a resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      resource[key] = req.body[key];
    });

    await resource.save();
    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource', message: error.message });
  }
});

// Toggle favorite status
router.patch('/:id/favorite', async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resource.isFavorite = !resource.isFavorite;
    await resource.save();

    res.json(resource);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite', message: error.message });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully', resource });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource', message: error.message });
  }
});

module.exports = router;
