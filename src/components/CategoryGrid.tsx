import React from 'react';
import { CATEGORIES } from '../constants/categories';
import { Category } from '../types';

interface CategoryGridProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  fileCounts: Record<Category, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onCategorySelect,
  fileCounts
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`p-4 rounded-lg border-2 transition-all ${
          selectedCategory === null
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="text-2xl mb-2">📁</div>
        <div className="text-sm font-medium">Tümü</div>
        <div className="text-xs text-gray-500">
          {Object.values(fileCounts).reduce((sum, count) => sum + count, 0)}
        </div>
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCategory === category.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl mb-2">{category.icon}</div>
          <div className="text-sm font-medium">{category.name}</div>
          <div className="text-xs text-gray-500">
            {fileCounts[category.id] || 0}
          </div>
        </button>
      ))}
    </div>
  );
};