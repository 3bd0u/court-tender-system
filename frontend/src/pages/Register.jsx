import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building, Phone, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';
import { APP_CONFIG } from '../config/app';
import BackgroundShapes from '../components/BackgroundShapes';

export default function Register() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    phone: '',
    address: '',
    registration_number: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/login', { 
        state: { message: t('registerSuccess') }
      });
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <BackgroundShapes />
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="w-full max-w-2xl">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <div className="glass rounded-lg p-2 flex gap-2">
              <button onClick={() => changeLanguage('ar')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${language === 'ar' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}>عربي</button>
              <button onClick={() => changeLanguage('fr')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${language === 'fr' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}>Fr</button>
            </div>
          </div>

          {/* Register Card */}
          <div className="card-gradient animate-scale-in">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-primary-400 blur-2xl opacity-30 animate-pulse"></div>
                <div className="w-20 h-20 mx-auto relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl float">
                  <span className="text-white font-bold text-3xl">م.ع</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gradient mb-2">{t('register')}</h1>
              <p className="text-gray-600">{language === 'ar' ? 'إنشاء حساب جديد للمترشحين' : 'Créer un compte candidat'}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">{language === 'ar' ? 'معلومات الحساب' : 'Informations du compte'}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
                    <div className="relative">
                      <User className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <div className="relative">
                      <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} required dir="ltr" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} required dir="ltr" />
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">{language === 'ar' ? 'معلومات الشركة' : 'Informations de l\'entreprise'}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('companyName')}</label>
                    <div className="relative">
                      <Building className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                      <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                      <div className="relative">
                        <Phone className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} dir="ltr" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('registrationNumber')}</label>
                      <div className="relative">
                        <FileText className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                        <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`} dir="ltr" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                    <div className="relative">
                      <MapPin className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={18} />
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><UserPlus size={20} /><span>{t('register')}</span></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {t('hasAccount')}{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">{t('login')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}