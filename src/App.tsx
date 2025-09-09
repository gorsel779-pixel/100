import React, { useState } from 'react';
import { Login } from './components/Login';
import { SearchBar } from './components/SearchBar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { CategoryGrid } from './components/CategoryGrid';
import { FileGrid } from './components/FileGrid';
import { Settings } from './components/Settings';
import { useFiles } from './hooks/useFiles';
import { SearchService } from './services/searchService';
import { Category } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [currentView, setCurrentView] = useState<'dashboard' | 'files' | 'analytics' | 'settings'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    files,
    loading,
    analyzing,
    uploadFiles,
    deleteFile,
    updateFileCategory,
    updateFileAnalysis,
    getFilesByCategory,
    storageStats
  } = useFiles();

  const searchService = new SearchService();
  
  let displayFiles = selectedCategory ? getFilesByCategory(selectedCategory) : files;
  
  if (searchTerm) {
    displayFiles = searchService.searchFiles(displayFiles, searchTerm);
  }

  const fileCounts = files.reduce((acc, file) => {
    acc[file.category] = (acc[file.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard files={files} storageStats={storageStats} />;
      
      case 'files':
        return (
          <div className="space-y-6">
            <SearchBar onSearch={setSearchTerm} />
            <FileUpload onUpload={uploadFiles} loading={loading} analyzing={analyzing} />
            <CategoryGrid
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              fileCounts={fileCounts}
            />
            {searchTerm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>"{searchTerm}"</strong> için {displayFiles.length} sonuç bulundu
                  {displayFiles.length !== files.length && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Aramayı temizle
                    </button>
                  )}
                </p>
              </div>
            )}
            <FileGrid
              files={displayFiles}
              onDelete={deleteFile}
              onCategoryChange={updateFileCategory}
              onFileUpdate={updateFileAnalysis}
            />
          </div>
        );
      
      case 'analytics':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analitik</h2>
            <p className="text-gray-600">Detaylı analitik raporları yakında eklenecek...</p>
          </div>
        );
      
      case 'settings':
        return <Settings />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;