import React, { useRef } from 'react';
import { Upload, Image, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: FileList) => void;
  loading: boolean;
  analyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, loading, analyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {analyzing ? 'Görüntüler analiz ediliyor...' : 'Dosyalar yükleniyor...'}
              </p>
              <p className="text-sm text-gray-500">
                {analyzing ? 'Gemini AI ile analiz yapılıyor' : 'Lütfen bekleyin'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <Upload className="w-12 h-12 text-gray-400" />
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Görüntüleri buraya sürükleyin veya tıklayın
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF dosyaları desteklenir
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};