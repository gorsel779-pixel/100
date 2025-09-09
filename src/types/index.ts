export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: Date;
  category: Category;
  analysis?: ImageAnalysis;
  cloudProvider: CloudProvider;
}

export interface ImageAnalysis {
  objects: string[];
  colors: string[];
  text: string;
  description: string;
  emotions: string[];
  style: string;
  occasion: string;
  ageGroup: string;
  gender: string;
  confidence: number;
  suggestedCategory: Category;
}

export type Category = 
  | 'erkek-cocuk'
  | 'kiz-cocuk' 
  | 'dugun-kina-nisan'
  | 'anneler-gunu'
  | 'kadinlar-gunu'
  | 'sunnet'
  | 'dogum-gunu'
  | 'diger';

export type CloudProvider = 'aws' | 'google' | 'azure' | 'local';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedSpace: number;
  availableSpace: number;
  categoryBreakdown: Record<Category, number>;
}