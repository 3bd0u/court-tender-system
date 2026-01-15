import { useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';

export default function DocumentUpload({ bidId, onUploadComplete, onClose }) {
  const { t, language } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('commerce_register');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const documentTypes = [
    { value: 'commerce_register', label: { ar: 'السجل التجاري', fr: 'Registre de Commerce' } },
    { value: 'certificate', label: { ar: 'شهادة', fr: 'Certificat' } },
    { value: 'insurance', label: { ar: 'تأمين', fr: 'Assurance' } },
    { value: 'tax_clearance', label: { ar: 'براءة ذمة ضريبية', fr: 'Quitus Fiscal' } },
    { value: 'other', label: { ar: 'أخرى', fr: 'Autre' } },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError(language === 'ar' ? 'نوع الملف غير مدعوم. استخدم PDF أو صورة' : 'Type de fichier non supporté. Utilisez PDF ou image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(language === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 10MB)' : 'Fichier trop volumineux (max 10MB)');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(language === 'ar' ? 'الرجاء اختيار ملف' : 'Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('document_type', documentType);

    try {
      await api.post(`/bids/${bidId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (onUploadComplete) {
      onUploadComplete();
    }
    if (onClose) {
      onClose();
    }
  };

  const resetAndUploadAnother = () => {
    setSuccess(false);
    setSelectedFile(null);
    setError('');
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'ar' ? '✅ تم بنجاح!' : '✅ Succès !'}
        </h3>
        <p className="text-gray-600 mb-6">
          {language === 'ar' ? 'تم رفع الوثيقة بنجاح' : 'Document téléchargé avec succès'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={resetAndUploadAnother}
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            <span>{language === 'ar' ? 'رفع وثيقة أخرى' : 'Télécharger un autre'}</span>
          </button>
          <button
            onClick={handleClose}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            <span>{language === 'ar' ? 'تم - إغلاق' : 'OK - Fermer'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نوع الوثيقة' : 'Type de document'}
        </label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="input-field"
          disabled={uploading}
        >
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label[language]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'اختر الملف' : 'Choisir le fichier'}
        </label>
        
        {!selectedFile ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'انقر لاختيار ملف' : 'Cliquez pour sélectionner un fichier'}
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (max 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <File className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{language === 'ar' ? 'جاري الرفع...' : 'Téléchargement...'}</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>{language === 'ar' ? 'رفع الوثيقة' : 'Télécharger le document'}</span>
          </>
        )}
      </button>
    </div>
  );
}