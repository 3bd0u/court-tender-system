import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },
  
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data;
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
  },
  
  isAdmin() {
    return this.getCurrentUser()?.role === 'admin';
  },
};