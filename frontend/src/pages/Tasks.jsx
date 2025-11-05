import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskService, authService } from '../services';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData);
      } else {
        await taskService.createTask(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        type: 'general',
        priority: 'medium',
        status: 'pending',
        progress: 0,
        dueDate: ''
      });
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      priority: task.priority,
      status: task.status,
      progress: task.progress,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleProgressChange = async (id, newProgress) => {
    try {
      await taskService.updateProgress(id, parseInt(newProgress));
      loadTasks();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-warning',
      'in-progress': 'badge-primary',
      'completed': 'badge-success',
      'overdue': 'badge-danger'
    };
    return badges[status] || 'badge-primary';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': 'badge-success',
      'medium': 'badge-primary',
      'high': 'badge-warning',
      'urgent': 'badge-danger'
    };
    return badges[priority] || 'badge-primary';
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
              <Link to="/courses" className="btn btn-outline">Courses</Link>
              <Link to="/resources" className="btn btn-outline">Resources</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="flex-between mb-4">
          <div>
            <h2>Tasks</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your assignments, projects, and goals</p>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                type: 'general',
                priority: 'medium',
                status: 'pending',
                progress: 0,
                dueDate: ''
              });
              setShowModal(true);
            }} 
            className="btn btn-primary"
          >
            + Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No tasks yet. Click "Add Task" to create one!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {tasks.map(task => (
              <div key={task._id} className="card">
                <div className="flex-between mb-2">
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{task.title}</h3>
                  <div className="flex gap-1">
                    <span className={`badge ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {task.description}
                  </p>
                )}

                <div className="mb-2">
                  <div className="flex-between mb-1">
                    <span style={{ fontSize: '0.875rem' }}>Progress</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{task.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task._id, e.target.value)}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>

                {task.dueDate && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(task)} className="btn btn-outline" style={{ flex: 1 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="btn btn-danger" style={{ flex: 1 }}>
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
              <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
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
                    <option value="general">General</option>
                    <option value="assignment">Assignment</option>
                    <option value="research">Research</option>
                    <option value="project">Project</option>
                    <option value="online-course">Online Course</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowModal(false);
                      setEditingTask(null);
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

export default Tasks;
