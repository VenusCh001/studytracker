import api from './api';

// NOTE: Using localStorage for token storage.
// For production, consider using httpOnly cookies for enhanced security against XSS attacks.
// Implement additional security measures like token rotation and short expiration times.
export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export const taskService = {
  async getTasks(filters = {}) {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async updateProgress(id, progress) {
    const response = await api.patch(`/tasks/${id}/progress`, { progress });
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export const courseService = {
  async getCourses(filters = {}) {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  async getCourse(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async createCourse(courseData) {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  async updateCourse(id, courseData) {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  async updateModuleCompletion(id, moduleIndex, completed) {
    const response = await api.patch(`/courses/${id}/modules/${moduleIndex}/complete`, { completed });
    return response.data;
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};

export const resourceService = {
  async getResources(filters = {}) {
    const response = await api.get('/resources', { params: filters });
    return response.data;
  },

  async getResource(id) {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  async createResource(resourceData) {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },

  async updateResource(id, resourceData) {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  async toggleFavorite(id) {
    const response = await api.patch(`/resources/${id}/favorite`);
    return response.data;
  },

  async deleteResource(id) {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};

export const progressService = {
  async getTodayProgress() {
    const response = await api.get('/progress/today');
    return response.data;
  },

  async getProgressRange(startDate, endDate) {
    const response = await api.get('/progress/range', { 
      params: { startDate, endDate } 
    });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/progress/stats');
    return response.data;
  },

  async updateProgress(progressData) {
    const response = await api.post('/progress/update', progressData);
    return response.data;
  }
};
