import React, { useState } from 'react';
import { UploadedFile, Category } from '../types';
import { CATEGORIES } from '../constants/categories';
import { Trash2, Edit3, Eye, Download, Crop } from 'lucide-react';
import { ImageRegionSelector } from './ImageRegionSelector';
import { GeminiService } from '../services/geminiService';

interface FileGridProps {
  files: UploadedFile[];
  onDelete: (fileId: string) => void;
  onCategoryChange: (fileId: string, category: Category) => void;
  onFileUpdate?: (fileId: string, analysis: any) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onDelete, onCategoryChange, onFileUpdate }) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [regionSelectorFile, setRegionSelectorFile] = useState<UploadedFile | null>(null);
  const [analyzingRegion, setAnalyzingRegion] = useState(false);
  
  const geminiService = new GeminiService();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryInfo = (categoryId: Category) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const handleRegionAnalyze = async (region: { x: number, y: number, width: number, height: number }) => {
    if (!regionSelectorFile) return;
    
    setAnalyzingRegion(true);
    try {
      // Dosyayı File nesnesine çevir (gerçek uygulamada farklı olabilir)
      const response = await fetch(regionSelectorFile.url);
      const blob = await response.blob();
      const file = new File([blob], regionSelectorFile.name, { type: regionSelectorFile.type });
      
      const analysis = await geminiService.analyzeImageRegion(file, region);
      
      // Mevcut analizi güncelle
      if (onFileUpdate && regionSelectorFile.analysis) {
        const updatedAnalysis = {
          ...regionSelectorFile.analysis,
          regionAnalysis: analysis,
          description: `${regionSelectorFile.analysis.description}\n\nBölge Analizi: ${analysis.description}`
        };
        onFileUpdate(regionSelectorFile.id, updatedAnalysis);
      }
      
      alert('Bölge analizi tamamlandı! Dosya detaylarında görebilirsiniz.');
    } catch (error) {
      console.error('Bölge analizi hatası:', error);
      alert('Bölge analizi sırasında hata oluştu.');
    } finally {
      setAnalyzingRegion(false);
      setRegionSelectorFile(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => {
          const categoryInfo = getCategoryInfo(file.category);
          
          return (
            <div key={file.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white ${categoryInfo.color}`}>
                  {categoryInfo.icon} {categoryInfo.name}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate mb-2">{file.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{formatFileSize(file.size)}</p>
                
                {file.analysis && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Analiz:</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{file.analysis.description}</p>
                    {file.analysis.objects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {file.analysis.objects.slice(0, 3).map((obj, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {obj}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="p-1 text-gray-400 hover:text-blue-500"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRegionSelectorFile(file)}
                      className="p-1 text-gray-400 hover:text-purple-500"
                      title="Bölge Seçimi ve Analiz"
                    >
                      <Crop className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingFile(editingFile === file.id ? null : file.id)}
                      className="p-1 text-gray-400 hover:text-green-500"
                      title="Kategori Değiştir"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {editingFile === file.id && (
                    <select
                      value={file.category}
                      onChange={(e) => {
                        onCategoryChange(file.id, e.target.value as Category);
                        setEditingFile(null);
                      }}
                      className="text-xs border rounded px-2 py-1"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dosya Detay Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedFile.name}</h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Dosya Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Boyut:</span> {formatFileSize(selectedFile.size)}</p>
                      <p><span className="font-medium">Tür:</span> {selectedFile.type}</p>
                      <p><span className="font-medium">Yüklenme:</span> {selectedFile.uploadDate.toLocaleDateString('tr-TR')}</p>
                      <p><span className="font-medium">Kategori:</span> {getCategoryInfo(selectedFile.category).name}</p>
                    </div>
                  </div>
                  
                  {selectedFile.analysis && (
                    <div>
                      <h3 className="font-medium mb-2">AI Analizi</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium">Açıklama:</p>
                          <p className="text-gray-600">{selectedFile.analysis.description}</p>
                        </div>
                        
                        {selectedFile.analysis.objects.length > 0 && (
                          <div>
                            <p className="font-medium">Tespit Edilen Nesneler:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFile.analysis.objects.map((obj, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedFile.analysis.colors.length > 0 && (
                          <div>
                            <p className="font-medium">Dominant Renkler:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFile.analysis.colors.map((color, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedFile.analysis.text && (
                          <div>
                            <p className="font-medium">Tespit Edilen Yazı:</p>
                            <p className="text-gray-600 bg-gray-50 p-2 rounded">{selectedFile.analysis.text}</p>
                          </div>
                        )}
                        
                        {selectedFile.analysis.emotions && selectedFile.analysis.emotions.length > 0 && (
                          <div>
                            <p className="font-medium">Duygusal İfadeler:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFile.analysis.emotions.map((emotion, idx) => (
                                <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedFile.analysis.style && (
                          <div>
                            <p className="font-medium">Stil:</p>
                            <p className="text-gray-600">{selectedFile.analysis.style}</p>
                          </div>
                        )}
                        
                        {selectedFile.analysis.occasion && (
                          <div>
                            <p className="font-medium">Uygun Etkinlik:</p>
                            <p className="text-gray-600">{selectedFile.analysis.occasion}</p>
                          </div>
                        )}
                        
                        {selectedFile.analysis.ageGroup && (
                          <div>
                            <p className="font-medium">Yaş Grubu:</p>
                            <p className="text-gray-600">{selectedFile.analysis.ageGroup}</p>
                          </div>
                        )}
                        
                        {selectedFile.analysis.gender && (
                          <div>
                            <p className="font-medium">Cinsiyet:</p>
                            <p className="text-gray-600">{selectedFile.analysis.gender}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bölge Seçici Modal */}
      {regionSelectorFile && (
        <ImageRegionSelector
          imageUrl={regionSelectorFile.url}
          onRegionAnalyze={handleRegionAnalyze}
          analyzing={analyzingRegion}
          onClose={() => setRegionSelectorFile(null)}
        />
      )}
    </>
  );
};