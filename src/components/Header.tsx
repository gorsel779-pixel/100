import React from 'react';
import { Cloud, BarChart3, Settings, User } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'files' | 'analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'files' | 'analytics' | 'settings') => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: Cloud },
    { id: 'files', label: 'Dosyalar', icon: Cloud },
    { id: 'analytics', label: 'Analitik', icon: BarChart3 },
    { id: 'settings', label: 'Ayarlar', icon: Settings }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Bulut Depo</h1>
            </div>
          </div>

          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
              title="Çıkış Yap"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};