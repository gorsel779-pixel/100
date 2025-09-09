import React from 'react';
import { UploadedFile } from '../types';
import { CATEGORIES } from '../constants/categories';
import { Cloud, HardDrive, Image, TrendingUp } from 'lucide-react';

interface DashboardProps {
  files: UploadedFile[];
  storageStats: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ files, storageStats }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercentage = (storageStats.usedSpace / storageStats.availableSpace) * 100;

  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Dosya</p>
              <p className="text-2xl font-bold text-gray-900">{storageStats.totalFiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Kullanılan Alan</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(storageStats.usedSpace)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Cloud className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bulut Sağlayıcı</p>
              <p className="text-2xl font-bold text-gray-900">AWS S3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Analiz Oranı</p>
              <p className="text-2xl font-bold text-gray-900">%95</p>
            </div>
          </div>
        </div>
      </div>

      {/* Depolama Kullanımı */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Depolama Kullanımı</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Kullanılan: {formatFileSize(storageStats.usedSpace)}</span>
            <span>Toplam: {formatFileSize(storageStats.availableSpace)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            %{usagePercentage.toFixed(1)} kullanılıyor
          </p>
        </div>
      </div>

      {/* Kategori Dağılımı */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kategori Dağılımı</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => {
            const count = storageStats.categoryBreakdown[category.id] || 0;
            const percentage = storageStats.totalFiles > 0 ? (count / storageStats.totalFiles) * 100 : 0;
            
            return (
              <div key={category.id} className="text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                <div className="text-xs text-gray-500">{count} dosya</div>
                <div className="text-xs text-gray-400">%{percentage.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Son Yüklenen Dosyalar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Son Yüklenen Dosyalar</h3>
        <div className="space-y-3">
          {files.slice(0, 5).map((file) => {
            const categoryInfo = CATEGORIES.find(cat => cat.id === file.category);
            return (
              <div key={file.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {categoryInfo?.name} • {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {file.uploadDate.toLocaleDateString('tr-TR')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};