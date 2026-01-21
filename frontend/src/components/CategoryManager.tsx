import { useState } from 'react';
import type { Category, CategoryRequest } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (category: CategoryRequest) => void;
  onDeleteCategory: (id: number) => void;
}

const CategoryManager = ({
  categories,
  onCreateCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Category name is required');
      return;
    }

    onCreateCategory({ name: newCategoryName.trim() });
    setNewCategoryName('');
    setIsOpen(false);
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🏷️ Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">Organize your notes by topics</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn-primary flex items-center gap-2 ${
            isOpen ? 'opacity-75' : ''
          }`}
        >
          <span className="text-xl">{isOpen ? '✕' : '+'}</span>
          <span>{isOpen ? 'Cancel' : 'New Category'}</span>
        </button>
      </div>

      {/* Create Category Form con animación */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-5 animate-float">
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="input-field flex-1"
              placeholder="✨ Enter category name..."
              maxLength={100}
              autoFocus
            />
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      )}

      {/* Categories List mejorada */}
      {categories.length === 0 ? (
        <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200">
          <div className="text-4xl mb-2">🏷️</div>
          <p className="text-gray-600 font-medium">
            No categories yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Create one to organize your notes!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group category-tag cursor-pointer"
            >
              <span className="font-medium">{category.name}</span>
              <button
                onClick={() => {
                  if (window.confirm(`Delete category "${category.name}"?`)) {
                    onDeleteCategory(category.id);
                  }
                }}
                className="hover:text-red-200 transition-all font-bold text-lg transform group-hover:rotate-90 duration-300"
                title="Delete category"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;