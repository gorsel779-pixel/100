import { UploadedFile, CloudProvider } from '../types';

export class StorageService {
  private storageKey = 'cloud-storage-files';

  // LocalStorage'dan dosyaları yükle
  loadFiles(): UploadedFile[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const files = JSON.parse(stored);
      return files.map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate)
      }));
    } catch (error) {
      console.error('Dosyalar yüklenirken hata:', error);
      return [];
    }
  }

  // LocalStorage'a dosyaları kaydet
  saveFiles(files: UploadedFile[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(files));
    } catch (error) {
      console.error('Dosyalar kaydedilirken hata:', error);
    }
  }

  // Dosya yükle (simülasyon)
  async uploadFile(file: File, provider: CloudProvider = 'aws'): Promise<string> {
    // Gerçek uygulamada burada AWS S3, Google Cloud Storage vb. kullanılır
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simüle edilmiş URL
        const url = URL.createObjectURL(file);
        resolve(url);
      }, 1000);
    });
  }

  // Dosya sil
  async deleteFile(fileId: string): Promise<void> {
    // Gerçek uygulamada bulut sağlayıcısından da silinir
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  // Depolama istatistikleri
  getStorageStats(files: UploadedFile[]) {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const usedSpace = totalSize;
    const availableSpace = 1024 * 1024 * 1024 * 100; // 100GB simülasyon
    
    const categoryBreakdown = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles,
      totalSize,
      usedSpace,
      availableSpace,
      categoryBreakdown
    };
  }
}