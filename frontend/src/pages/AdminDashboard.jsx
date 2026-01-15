import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Users, TrendingUp, Plus, LogOut, Globe, Eye, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';
import { dashboardService, projectsService, bidsService } from '../services/projects';
import { APP_CONFIG } from '../config/app';
import BackgroundShapes from '../components/BackgroundShapes';

export default function AdminDashboard() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentBids, setRecentBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, projectsData, bidsData] = await Promise.all([
        dashboardService.getStats(),
        projectsService.getAll(),
        bidsService.getAll(),
      ]);

      setStats(statsData);
      setRecentProjects(projectsData.slice(0, 5));
      setRecentBids(bidsData.slice(0, 5));
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

  const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    awarded: 'bg-blue-100 text-blue-800',
    submitted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundShapes />
      <div className={`min-h-screen relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">م.ع</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {APP_CONFIG.shortName[language]}
                  </h1>
                  <p className="text-sm text-gray-600">{t('dashboard')} - {t('admin')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Language */}
                <button
                  onClick={() => changeLanguage(language === 'ar' ? 'fr' : 'ar')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe size={20} className="text-gray-600" />
                </button>

                {/* User */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700 font-medium">{user?.username}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
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
          {/* Welcome Banner */}
          <div className="gradient-bg rounded-3xl p-8 mb-8 text-white shadow-2xl animate-scale-in">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-4 inline-block">
                <Briefcase className="w-16 h-16 opacity-80 float" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{t('welcomeBack')}, {user?.username}!</h2>
              <p className="text-lg opacity-90">{language === 'ar' ? 'إليك ملخص النشاطات اليوم' : 'Voici un résumé des activités d\'aujourd\'hui'}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stats-card animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{t('totalProjects')}</p>
                  <p className="text-4xl font-bold text-gradient">{stats?.total_projects || 0}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-blue-400 to-blue-600">
                  <Briefcase className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{t('openProjects')}</p>
                  <p className="text-4xl font-bold text-gradient">{stats?.open_projects || 0}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-green-400 to-green-600">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{t('totalBids')}</p>
                  <p className="text-4xl font-bold text-gradient">{stats?.total_bids || 0}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-purple-400 to-purple-600">
                  <FileText className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{t('pendingBids')}</p>
                  <p className="text-4xl font-bold text-gradient">{stats?.pending_bids || 0}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-orange-400 to-orange-600">
                  <Users className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'إجراءات سريعة' : 'Actions Rapides'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/admin/projects')}
                className="card hover:shadow-md transition-all hover:scale-105 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Plus className="text-primary-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {language === 'ar' ? 'إدارة المشاريع' : 'Gérer les Projets'}
                  </span>
                </div>
              </button>
              <button className="card hover:shadow-md transition-all hover:scale-105 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="text-blue-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {language === 'ar' ? 'مراجعة العروض' : 'Réviser les Offres'}
                  </span>
                </div>
              </button>
              <button className="card hover:shadow-md transition-all hover:scale-105 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {language === 'ar' ? 'الموافقات المعلقة' : 'Approbations en Attente'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Projects & Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'المشاريع الأخيرة' : 'Projets Récents'}
                </h3>
                <button 
                  onClick={() => navigate('/admin/projects')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {language === 'ar' ? 'عرض الكل' : 'Voir tout'}
                </button>
              </div>
              <div className="space-y-3">
                {recentProjects.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">{t('noData')}</p>
                ) : (
                  recentProjects.map((project) => (
                    <div key={project.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}>
                          {t(project.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{project.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(project.deadline).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                        <span>{project.budget?.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Bids */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'العروض الأخيرة' : 'Offres Récentes'}
              </h3>
              <div className="space-y-3">
                {recentBids.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">{t('noData')}</p>
                ) : (
                  recentBids.map((bid) => (
                    <div key={bid.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{bid.company_name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[bid.status]}`}>
                          {t(bid.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{bid.project_title}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{bid.proposed_amount?.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                        <span>{bid.proposed_timeline}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}