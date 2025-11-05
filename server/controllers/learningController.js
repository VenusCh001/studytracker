const LearningResource = require('../models/LearningResource');

// Get all learning resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await LearningResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

// Get single resource
exports.getResource = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource', error: error.message });
  }
};

// Create resource
exports.createResource = async (req, res) => {
  try {
    const resource = new LearningResource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: 'Error creating resource', error: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const resource = await LearningResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: 'Error updating resource', error: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await LearningResource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error: error.message });
  }
};

// Auto-fetch from platform (mock implementation)
exports.autoFetchFromPlatform = async (req, res) => {
  try {
    const { platform, courseUrl } = req.body;
    
    // Mock auto-fetch - in real implementation, this would scrape/API call to platform
    const mockResourceData = {
      title: `Auto-fetched course from ${platform}`,
      platform: platform,
      url: courseUrl,
      type: 'course',
      autoFetched: true,
      progress: 0
    };
    
    const resource = new LearningResource(mockResourceData);
    await resource.save();
    
    res.status(201).json({
      message: 'Resource auto-fetched successfully',
      resource
    });
  } catch (error) {
    res.status(400).json({ message: 'Error auto-fetching resource', error: error.message });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const resource = await LearningResource.findByIdAndUpdate(
      req.params.id,
      { progress },
      { new: true, runValidators: true }
    );
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: 'Error updating progress', error: error.message });
  }
};
