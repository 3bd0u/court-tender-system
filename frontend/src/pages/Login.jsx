import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';
import { APP_CONFIG } from '../config/app';
import BackgroundShapes from '../components/BackgroundShapes';

export default function Login() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      
      // Rediriger selon le rôle
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <BackgroundShapes />
      <div className={`min-h-screen flex items-center justify-center p-4 relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <div className="glass rounded-lg p-2 flex gap-2">
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${language === 'ar' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
              >
                عربي
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${language === 'fr' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
              >
                Fr
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="card-gradient animate-scale-in">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary-400 blur-2xl opacity-30 animate-pulse"></div>
                <div className="w-24 h-24 mx-auto relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl float">
                  <span className="text-white font-bold text-4xl">م.ع</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gradient mb-2">
                {APP_CONFIG.shortName[language]}
              </h1>
              <p className="text-gray-600 font-medium">
                {APP_CONFIG.admin[language]}
              </p>
            </div>

            {/* Title */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {t('login')}
              </h2>
              <p className="text-gray-600">
                {t('welcomeBack')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={language === 'ar' ? 'admin@court.dz' : 'admin@court.dz'}
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="••••••••"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>{t('login')}</span>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {t('noAccount')}{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('register')}
                </Link>
              </p>
            </div>

            {/* Test Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                {language === 'ar' ? 'حسابات تجريبية' : 'Comptes de test'}
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">Admin:</span>
                  <code className="text-gray-600">admin@court.dz / admin123</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">Candidat:</span>
                  <code className="text-gray-600">test@company.dz / test123</code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              {APP_CONFIG.name[language]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}