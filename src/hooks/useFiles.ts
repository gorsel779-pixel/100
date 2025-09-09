import { useState, useEffect } from 'react';
import { UploadedFile, Category } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';

const storageService = new StorageService();
const geminiService = new GeminiService();

export const useFiles = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Uygulama başladığında dosyaları yükle
  useEffect(() => {
    const savedFiles = storageService.loadFiles();
    setFiles(savedFiles);
  }, []);

  // Dosyalar değiştiğinde kaydet
  useEffect(() => {
    storageService.saveFiles(files);
  }, [files]);

  const uploadFiles = async (fileList: FileList) => {
    setLoading(true);
    setAnalyzing(true);

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      try {
        // Dosyayı yükle
        const url = await storageService.uploadFile(file);
        
        // Görüntü analizi yap
        const analysis = await geminiService.analyzeImage(file);
        
        const newFile: UploadedFile = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          uploadDate: new Date(),
          category: analysis.suggestedCategory,
          analysis,
          cloudProvider: 'aws'
        };

        newFiles.push(newFile);
      } catch (error) {
        console.error('Dosya yükleme hatası:', error);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    setLoading(false);
    setAnalyzing(false);
  };

  const deleteFile = async (fileId: string) => {
    try {
      await storageService.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Dosya silme hatası:', error);
    }
  };

  const updateFileCategory = (fileId: string, category: Category) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, category } : file
    ));
  };

  const updateFileAnalysis = (fileId: string, analysis: any) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, analysis } : file
    ));
  };
  const getFilesByCategory = (category: Category) => {
    return files.filter(file => file.category === category);
  };

  return {
    files,
    loading,
    analyzing,
    uploadFiles,
    deleteFile,
    updateFileCategory,
    updateFileAnalysis,
    getFilesByCategory,
    storageStats: storageService.getStorageStats(files)
  };
};