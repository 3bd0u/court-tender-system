import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { APP_CONFIG } from '../config/app';
import { authService } from '../services/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, language, changeLanguage, isRTL } = useTranslation();
  
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">م.ع</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-xl font-bold text-gray-900">
                  {APP_CONFIG.shortName[language]}
                </h1>
                <p className="text-xs text-gray-500">
                  {APP_CONFIG.admin[language]}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('home')}
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('projects')}
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('dashboard')}
                </Link>
                {user?.role === 'candidate' && (
                  <Link to="/my-bids" className="text-gray-700 hover:text-primary-600 transition-colors">
                    {t('myBids')}
                  </Link>
                )}
              </>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Globe size={20} />
                <span className="uppercase text-sm font-medium">{language}</span>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <button
                    onClick={() => { changeLanguage('ar'); setShowLangMenu(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-100 ${language === 'ar' ? 'bg-primary-50 text-primary-600' : ''}`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => { changeLanguage('fr'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${language === 'fr' ? 'bg-primary-50 text-primary-600' : ''}`}
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary-600 py-2">
                {t('home')}
              </Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary-600 py-2">
                {t('projects')}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 py-2">
                    {t('dashboard')}
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 text-left py-2">
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 py-2">
                    {t('login')}
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}