import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, taskService, courseService, progressService } from '../services';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, tasksData, coursesData] = await Promise.all([
        progressService.getStats(),
        taskService.getTasks({ status: 'in-progress' }),
        courseService.getCourses({ status: 'in-progress' })
      ]);

      setStats(statsData);
      setTasks(tasksData.slice(0, 5)); // Show top 5 tasks
      setCourses(coursesData.slice(0, 5)); // Show top 5 courses
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
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
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
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
              <Link to="/tasks" className="btn btn-outline">Tasks</Link>
              <Link to="/courses" className="btn btn-outline">Courses</Link>
              <Link to="/resources" className="btn btn-outline">Resources</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Welcome Section */}
        <div className="mb-4">
          <h2>Welcome back! 👋</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Here's your academic progress overview</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-3 mb-4">
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Tasks Completed
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {stats.tasks.completed}/{stats.tasks.total}
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${stats.tasks.completionRate}%` }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {stats.tasks.completionRate}% complete
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Courses Progress
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {stats.courses.completed}/{stats.courses.total}
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${stats.courses.completionRate}%` }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {stats.courses.completionRate}% complete
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Current Streak
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                🔥 {stats.streaks.current}
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                Longest: {stats.streaks.longest} days
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-2">
          {/* Active Tasks */}
          <div className="card">
            <div className="flex-between mb-3">
              <h3>Active Tasks</h3>
              <Link to="/tasks" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                View All
              </Link>
            </div>

            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No active tasks. Great job! 🎉</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.map(task => (
                  <div key={task._id} style={{ 
                    padding: '1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem'
                  }}>
                    <div className="flex-between mb-2">
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>{task.title}</h4>
                      <span className={`badge ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="progress-bar mb-2">
                      <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                    </div>
                    <div className="flex-between">
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {task.progress}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Courses */}
          <div className="card">
            <div className="flex-between mb-3">
              <h3>Active Courses</h3>
              <Link to="/courses" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                View All
              </Link>
            </div>

            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No active courses yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {courses.map(course => (
                  <div key={course._id} style={{ 
                    padding: '1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem'
                  }}>
                    <div className="flex-between mb-2">
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>{course.title}</h4>
                      <span className="badge badge-primary">{course.platform}</span>
                    </div>
                    <div className="progress-bar mb-2">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex-between">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {course.modules?.length || 0} modules
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {course.progress}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
