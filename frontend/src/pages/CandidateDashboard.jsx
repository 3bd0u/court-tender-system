import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Clock, CheckCircle, XCircle, LogOut, Globe, Upload, Eye } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';
import { projectsService, bidsService } from '../services/projects';
import { APP_CONFIG } from '../config/app';
import BackgroundShapes from '../components/BackgroundShapes';
import Modal from '../components/Modal';

export default function CandidateDashboard() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [projects, setProjects] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidForm, setBidForm] = useState({
    proposed_amount: '',
    proposed_timeline: '',
    technical_proposal: null,
    financial_proposal: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, bidsData] = await Promise.all([
        projectsService.getAll(),
        bidsService.getMine(),
      ]);
      setProjects(projectsData.filter(p => p.status === 'open'));
      setMyBids(bidsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const openBidModal = (project) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('project_id', selectedProject.id);
      formDataToSend.append('proposed_amount', bidForm.proposed_amount);
      formDataToSend.append('proposed_timeline', bidForm.proposed_timeline);
      
      if (bidForm.technical_proposal) {
        formDataToSend.append('technical_proposal', bidForm.technical_proposal);
      }
      if (bidForm.financial_proposal) {
        formDataToSend.append('financial_proposal', bidForm.financial_proposal);
      }

      await bidsService.create(formDataToSend);
      setShowBidModal(false);
      setBidForm({
        proposed_amount: '',
        proposed_timeline: '',
        technical_proposal: null,
        financial_proposal: null,
      });
      loadData();
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    submitted: Clock,
    under_review: Clock,
    accepted: CheckCircle,
    rejected: XCircle,
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
                  <p className="text-sm text-gray-600">{t('dashboard')} - {t('candidate')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => changeLanguage(language === 'ar' ? 'fr' : 'ar')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe size={20} className="text-gray-600" />
                </button>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700 font-medium">{user?.username}</span>
                </div>

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
              <p className="text-lg opacity-90">
                {language === 'ar' ? 'استعرض المشاريع المتاحة وقدم عروضك' : 'Découvrez les projets disponibles et soumettez vos offres'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stats-card animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{language === 'ar' ? 'مشاريع متاحة' : 'Projets Disponibles'}</p>
                  <p className="text-4xl font-bold text-gradient">{projects.length}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-blue-400 to-blue-600">
                  <Briefcase className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{language === 'ar' ? 'عروضي' : 'Mes Offres'}</p>
                  <p className="text-4xl font-bold text-gradient">{myBids.length}</p>
                </div>
                <div className="icon-container bg-gradient-to-br from-purple-400 to-purple-600">
                  <FileText className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{language === 'ar' ? 'عروض مقبولة' : 'Offres Acceptées'}</p>
                  <p className="text-4xl font-bold text-gradient">
                    {myBids.filter(b => b.status === 'accepted').length}
                  </p>
                </div>
                <div className="icon-container bg-gradient-to-br from-green-400 to-green-600">
                  <CheckCircle className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Available Projects & My Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Projects */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'المشاريع المتاحة' : 'Projets Disponibles'}
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">{t('noData')}</p>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md">
                      <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>{new Date(project.deadline).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                        <span className="font-semibold">{project.budget?.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                      </div>
                      <button
                        onClick={() => openBidModal(project)}
                        className="w-full btn-primary text-sm py-2"
                        disabled={myBids.some(b => b.project_id === project.id)}
                      >
                        {myBids.some(b => b.project_id === project.id) ? 
                          (language === 'ar' ? 'تم التقديم' : 'Déjà soumis') :
                          (language === 'ar' ? 'تقديم عرض' : 'Soumettre une offre')
                        }
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Bids */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'عروضي' : 'Mes Offres'}
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {myBids.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">{t('noData')}</p>
                ) : (
                  myBids.map((bid) => {
                    const StatusIcon = statusIcons[bid.status];
                    return (
                      <div key={bid.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1 flex-1">
                            {bid.project_title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap ml-2 ${statusColors[bid.status]}`}>
                            <StatusIcon size={14} />
                            {t(bid.status)}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>{language === 'ar' ? 'المبلغ:' : 'Montant:'}</span>
                            <span className="font-semibold">{bid.proposed_amount?.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'ar' ? 'المدة:' : 'Délai:'}</span>
                            <span>{bid.proposed_timeline}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>{language === 'ar' ? 'تاريخ التقديم:' : 'Soumis le:'}</span>
                            <span>{new Date(bid.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bid Modal */}
      <Modal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        title={language === 'ar' ? 'تقديم عرض' : 'Soumettre une offre'}
        size="lg"
      >
        <form onSubmit={handleSubmitBid} className="space-y-4">
          {selectedProject && (
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-900 mb-1">{selectedProject.title}</h4>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? 'المبلغ المقترح (دج)' : 'Montant proposé (DA)'}
            </label>
            <input
              type="number"
              value={bidForm.proposed_amount}
              onChange={(e) => setBidForm({ ...bidForm, proposed_amount: e.target.value })}
              className="input-field"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? 'المدة المقترحة' : 'Délai proposé'}
            </label>
            <input
              type="text"
              value={bidForm.proposed_timeline}
              onChange={(e) => setBidForm({ ...bidForm, proposed_timeline: e.target.value })}
              className="input-field"
              placeholder={language === 'ar' ? 'مثال: 3 أشهر' : 'Ex: 3 mois'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? 'العرض الفني (PDF)' : 'Offre technique (PDF)'}
            </label>
            <input
              type="file"
              onChange={(e) => setBidForm({ ...bidForm, technical_proposal: e.target.files[0] })}
              className="input-field"
              accept=".pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? 'العرض المالي (PDF)' : 'Offre financière (PDF)'}
            </label>
            <input
              type="file"
              onChange={(e) => setBidForm({ ...bidForm, financial_proposal: e.target.files[0] })}
              className="input-field"
              accept=".pdf"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowBidModal(false)} className="flex-1 btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
              {loading ? t('loading') : t('submit')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}