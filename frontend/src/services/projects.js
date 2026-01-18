// frontend/src/services/projects.js
import api from './api';

// ============================================
// PROJECTS SERVICE
// ============================================
export const projectsService = {
  // Récupérer tous les projets
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Récupérer un projet par ID
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Créer un nouveau projet (admin)
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Mettre à jour un projet (admin)
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Supprimer un projet (admin)
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// ============================================
// BIDS SERVICE
// ============================================
export const bidsService = {
  // Récupérer toutes les offres (admin)
  getAll: async () => {
    const response = await api.get('/admin/bids');
    return response.data;
  },

  // Récupérer MES offres (candidat) ← FONCTION MANQUANTE !
  getMine: async () => {
    const response = await api.get('/bids/mine');
    return response.data;
  },

  // Soumettre une offre
  create: async (projectId, formData) => {
    const response = await api.post(`/projects/${projectId}/bids`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour le statut d'une offre (admin)
  updateStatus: async (bidId, status, notes) => {
    const response = await api.put(`/admin/bids/${bidId}/status`, {
      status,
      notes,
    });
    return response.data;
  },
};

// ============================================
// DASHBOARD SERVICE
// ============================================
export const dashboardService = {
  // Récupérer les statistiques (admin)
  getStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export default {
  projectsService,
  bidsService,
  dashboardService,
};