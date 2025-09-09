import React, { useState } from 'react';
import { Key, Cloud, Brain, Shield, Bell } from 'lucide-react';

export const Settings: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSaveSettings = () => {
    // Ayarları localStorage'a kaydet
    localStorage.setItem('gemini-api-key', geminiKey);
    localStorage.setItem('auto-analysis', autoAnalysis.toString());
    localStorage.setItem('notifications', notifications.toString());
    
    alert('Ayarlar kaydedildi!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">API Ayarları</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Anahtarı
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Gemini API anahtarınızı girin"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Google AI Studio'dan ücretsiz API anahtarı alabilirsiniz
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Cloud className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Bulut Depolama</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">AWS S3</span>
              </div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-xs text-gray-500">100GB Kapasite</p>
            </div>
            
            <div className="p-4 border rounded-lg opacity-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-medium">Google Cloud</span>
              </div>
              <p className="text-sm text-gray-600">Pasif</p>
              <p className="text-xs text-gray-500">Yapılandırılmamış</p>
            </div>
            
            <div className="p-4 border rounded-lg opacity-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-medium">Azure Blob</span>
              </div>
              <p className="text-sm text-gray-600">Pasif</p>
              <p className="text-xs text-gray-500">Yapılandırılmamış</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI Analiz Ayarları</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Otomatik Analiz</h3>
              <p className="text-sm text-gray-600">Yüklenen dosyalar otomatik olarak analiz edilsin</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAnalysis}
                onChange={(e) => setAutoAnalysis(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Bildirimler</h3>
              <p className="text-sm text-gray-600">Analiz tamamlandığında bildirim al</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Güvenlik</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Önemli Bilgi</h3>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              API anahtarlarınız güvenli bir şekilde tarayıcınızda saklanır ve hiçbir sunucuya gönderilmez.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ayarları Kaydet
        </button>
      </div>
    </div>
  );
};