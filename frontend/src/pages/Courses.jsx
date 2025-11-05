import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, authService } from '../services';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'custom',
    url: '',
    instructor: '',
    status: 'not-started'
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, formData);
      } else {
        await courseService.createCourse(formData);
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        platform: 'custom',
        url: '',
        instructor: '',
        status: 'not-started'
      });
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      platform: course.platform,
      url: course.url || '',
      instructor: course.instructor || '',
      status: course.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id);
        loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'not-started': 'badge-warning',
      'in-progress': 'badge-primary',
      'completed': 'badge-success',
      'paused': 'badge-danger'
    };
    return badges[status] || 'badge-primary';
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
              <Link to="/resources" className="btn btn-outline">Resources</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="flex-between mb-4">
          <div>
            <h2>Courses</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Track your online learning and course progress</p>
          </div>
          <button 
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                title: '',
                description: '',
                platform: 'custom',
                url: '',
                instructor: '',
                status: 'not-started'
              });
              setShowModal(true);
            }} 
            className="btn btn-primary"
          >
            + Add Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No courses yet. Click "Add Course" to create one!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {courses.map(course => (
              <div key={course._id} className="card">
                <div className="flex-between mb-2">
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{course.title}</h3>
                  <div className="flex gap-1">
                    <span className="badge badge-primary">{course.platform}</span>
                    <span className={`badge ${getStatusBadge(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                {course.instructor && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    By: {course.instructor}
                  </p>
                )}

                {course.description && (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {course.description}
                  </p>
                )}

                <div className="mb-2">
                  <div className="flex-between mb-1">
                    <span style={{ fontSize: '0.875rem' }}>Progress</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                {course.url && (
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'block',
                      color: 'var(--primary)',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                      textDecoration: 'none'
                    }}
                  >
                    🔗 View Course
                  </a>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(course)} className="btn btn-outline" style={{ flex: 1 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(course._id)} className="btn btn-danger" style={{ flex: 1 }}>
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
              <h3>{editingCourse ? 'Edit Course' : 'New Course'}</h3>
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
                  <label className="form-label">Platform</label>
                  <select
                    className="form-select"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="custom">Custom</option>
                    <option value="youtube">YouTube</option>
                    <option value="udemy">Udemy</option>
                    <option value="coursera">Coursera</option>
                    <option value="edx">edX</option>
                    <option value="geeksforgeeks">GeeksforGeeks</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Course URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instructor</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingCourse ? 'Update' : 'Create'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
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

export default Courses;
