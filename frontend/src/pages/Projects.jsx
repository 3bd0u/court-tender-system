import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Calendar, DollarSign, Filter, LogOut, Globe, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';
import { projectsService } from '../services/projects';
import { APP_CONFIG } from '../config/app';
import Modal from '../components/Modal';

export default function Projects() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: 'repair',
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status === filterStatus));
    }
  }, [filterStatus, projects]);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProject) {
        await projectsService.update(editingProject.id, formData);
      } else {
        await projectsService.create(formData);
      }
      
      setShowModal(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      project_type: project.project_type,
      budget: project.budget,
      deadline: project.deadline.split('T')[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Êtes-vous sûr de supprimer ce projet ?')) {
      return;
    }

    try {
      await projectsService.delete(id);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(t('error'));
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      project_type: 'repair',
      budget: '',
      deadline: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    awarded: 'bg-blue-100 text-blue-800',
  };

  const projectTypes = {
    repair: { ar: 'إصلاح', fr: 'Réparation' },
    construction: { ar: 'بناء', fr: 'Construction' },
    maintenance: { ar: 'صيانة', fr: 'Maintenance' },
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('projects')}</h1>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'إدارة المشاريع' : 'Gestion des projets'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => changeLanguage(language === 'ar' ? 'fr' : 'ar')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => { authService.logout(); navigate('/login'); }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              <span>{language === 'ar' ? 'مشروع جديد' : 'Nouveau Projet'}</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
              <option value="open">{t('open')}</option>
              <option value="closed">{t('closed')}</option>
              <option value="under_review">{t('underReview')}</option>
              <option value="awarded">{t('awarded')}</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-600">{t('noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${statusColors[project.status]}`}>
                    {t(project.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{t('projectType')}:</span>
                    <span>{projectTypes[project.project_type][language]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    <span>{project.budget?.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(project.deadline).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={16} />
                    <span className="text-sm">{t('edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">{t('delete')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? t('edit') + ' ' + t('projectTitle') : language === 'ar' ? 'مشروع جديد' : 'Nouveau Projet'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('projectTitle')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('projectType')}</label>
              <select
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                className="input-field"
                required
              >
                <option value="repair">{t('repair')}</option>
                <option value="construction">{t('construction')}</option>
                <option value="maintenance">{t('maintenance')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('budget')}</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="input-field"
                required
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('deadline')}</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field"
              required
              dir="ltr"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
              {loading ? t('loading') : t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}