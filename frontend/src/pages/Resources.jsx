import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceService, authService } from '../services';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'note',
    content: '',
    url: '',
    category: 'other',
    tags: ''
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resourceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingResource) {
        await resourceService.updateResource(editingResource._id, resourceData);
      } else {
        await resourceService.createResource(resourceData);
      }
      setShowModal(false);
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        type: 'note',
        content: '',
        url: '',
        category: 'other',
        tags: ''
      });
      loadResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || '',
      type: resource.type,
      content: resource.content || '',
      url: resource.url || '',
      category: resource.category,
      tags: resource.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.deleteResource(id);
        loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await resourceService.toggleFavorite(id);
      loadResources();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getTypeBadge = (type) => {
    const badges = {
      'note': 'badge-primary',
      'link': 'badge-success',
      'file': 'badge-warning',
      'reference': 'badge-primary',
      'document': 'badge-secondary'
    };
    return badges[type] || 'badge-primary';
  };

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'var(--surface)', 
        boxShadow: '0 2px 8px var(--shadow)',
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ padding: '1rem' }}>
          <div className="flex-between">
            <h1 style={{ fontSize: '1.5rem' }}>📚 StudyTrackr</h1>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
              <Link to="/tasks" className="btn btn-outline">Tasks</Link>
              <Link to="/courses" className="btn btn-outline">Courses</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="flex-between mb-4">
          <div>
            <h2>Resources</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Store your notes, links, and study materials</p>
          </div>
          <button 
            onClick={() => {
              setEditingResource(null);
              setFormData({
                title: '',
                description: '',
                type: 'note',
                content: '',
                url: '',
                category: 'other',
                tags: ''
              });
              setShowModal(true);
            }} 
            className="btn btn-primary"
          >
            + Add Resource
          </button>
        </div>

        {resources.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No resources yet. Click "Add Resource" to create one!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {resources.map(resource => (
              <div key={resource._id} className="card">
                <div className="flex-between mb-2">
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{resource.title}</h3>
                  <button 
                    onClick={() => handleToggleFavorite(resource._id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '1.5rem', 
                      cursor: 'pointer' 
                    }}
                  >
                    {resource.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>

                <div className="flex gap-1 mb-2">
                  <span className={`badge ${getTypeBadge(resource.type)}`}>
                    {resource.type}
                  </span>
                  <span className="badge badge-primary">{resource.category}</span>
                </div>

                {resource.description && (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {resource.description}
                  </p>
                )}

                {resource.content && (
                  <p style={{ 
                    backgroundColor: 'var(--background)', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}>
                    {resource.content}
                  </p>
                )}

                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'block',
                      color: 'var(--primary)',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                      textDecoration: 'none',
                      wordBreak: 'break-all'
                    }}
                  >
                    🔗 {resource.url}
                  </a>
                )}

                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(resource)} className="btn btn-outline" style={{ flex: 1 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(resource._id)} className="btn btn-danger" style={{ flex: 1 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h3>{editingResource ? 'Edit Resource' : 'New Resource'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="note">Note</option>
                    <option value="link">Link</option>
                    <option value="file">File</option>
                    <option value="reference">Reference</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="other">Other</option>
                    <option value="lecture-notes">Lecture Notes</option>
                    <option value="reading-material">Reading Material</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="book">Book</option>
                  </select>
                </div>

                {formData.type === 'note' && (
                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-textarea"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      style={{ minHeight: '150px' }}
                    />
                  </div>
                )}

                {formData.type === 'link' && (
                  <div className="form-group">
                    <label className="form-label">URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="javascript, react, tutorial"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingResource ? 'Update' : 'Create'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowModal(false);
                      setEditingResource(null);
                    }} 
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
