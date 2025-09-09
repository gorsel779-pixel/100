import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { SearchService } from '../services/searchService';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Görüntülerde ara... (örn: kina, hos geldin, mavi)" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [correctedTerm, setCorrectedTerm] = useState('');
  const searchService = new SearchService();

  useEffect(() => {
    if (searchTerm) {
      const corrected = searchService.correctText(searchTerm);
      if (corrected !== searchTerm.toLowerCase()) {
        setCorrectedTerm(corrected);
      } else {
        setCorrectedTerm('');
      }
    } else {
      setCorrectedTerm('');
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    const corrected = searchService.correctText(term);
    onSearch(corrected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCorrectedTerm('');
    onSearch('');
  };

  const useCorrectedTerm = () => {
    setSearchTerm(correctedTerm);
    handleSearch(correctedTerm);
    setCorrectedTerm('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {correctedTerm && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Bunu mu demek istediniz: <strong>{correctedTerm}</strong>
              </span>
            </div>
            <button
              onClick={useCorrectedTerm}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Kullan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};