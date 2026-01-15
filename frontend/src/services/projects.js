import api from './api';

export const projectsService = {
  async getAll(status = null) {
    const params = status ? { status } : {};
    const { data } = await api.get('/projects', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  async create(projectData) {
    const { data } = await api.post('/projects', projectData);
    return data;
  },

  async update(id, projectData) {
    const { data } = await api.put(`/projects/${id}`, projectData);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
};

export const bidsService = {
  async getAll(projectId = null) {
    const url = projectId ? `/admin/bids?project_id=${projectId}` : '/admin/bids';
    const { data } = await api.get(url);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/admin/bids/${id}`);
    return data;
  },

  async updateStatus(id, status, notes = '') {
    const { data } = await api.put(`/admin/bids/${id}/status`, { status, notes });
    return data;
  },
};

export const dashboardService = {
  async getStats() {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
};