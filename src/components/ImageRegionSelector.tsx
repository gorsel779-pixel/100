import React, { useState, useRef, useCallback } from 'react';
import { Crop, Loader2, X } from 'lucide-react';

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageRegionSelectorProps {
  imageUrl: string;
  onRegionAnalyze: (region: Region) => void;
  analyzing: boolean;
  onClose: () => void;
}

export const ImageRegionSelector: React.FC<ImageRegionSelectorProps> = ({
  imageUrl,
  onRegionAnalyze,
  analyzing,
  onClose
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRelativeCoordinates = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current || !containerRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (analyzing) return;
    
    const coords = getRelativeCoordinates(e);
    setStartPoint(coords);
    setIsSelecting(true);
    setCurrentRegion(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !startPoint || analyzing) return;
    
    const coords = getRelativeCoordinates(e);
    const region: Region = {
      x: Math.min(startPoint.x, coords.x),
      y: Math.min(startPoint.y, coords.y),
      width: Math.abs(coords.x - startPoint.x),
      height: Math.abs(coords.y - startPoint.y)
    };
    
    setCurrentRegion(region);
  };

  const handleMouseUp = () => {
    if (!isSelecting || !currentRegion) return;
    
    setIsSelecting(false);
    setStartPoint(null);
  };

  const analyzeRegion = () => {
    if (currentRegion && !analyzing) {
      onRegionAnalyze(currentRegion);
    }
  };

  const clearSelection = () => {
    setCurrentRegion(null);
    setIsSelecting(false);
    setStartPoint(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium">Bölge Seçimi ve Analiz</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            Analiz etmek istediğiniz bölgeyi seçmek için fare ile sürükleyin
          </div>

          <div 
            ref={containerRef}
            className="relative inline-block border border-gray-300 rounded-lg overflow-hidden"
            style={{ cursor: analyzing ? 'wait' : 'crosshair' }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Bölge seçimi"
              className="max-w-full max-h-96 object-contain"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              draggable={false}
            />
            
            {currentRegion && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                style={{
                  left: currentRegion.x,
                  top: currentRegion.y,
                  width: currentRegion.width,
                  height: currentRegion.height,
                  pointerEvents: 'none'
                }}
              />
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="text-gray-900">Bölge analiz ediliyor...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={analyzeRegion}
              disabled={!currentRegion || analyzing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analiz ediliyor...</span>
                </>
              ) : (
                <>
                  <Crop className="w-4 h-4" />
                  <span>Seçili Bölgeyi Analiz Et</span>
                </>
              )}
            </button>
            
            <button
              onClick={clearSelection}
              disabled={analyzing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Seçimi Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};