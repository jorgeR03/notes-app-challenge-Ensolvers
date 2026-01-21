import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700">Filter by:</span>
      <button
        onClick={() => onSelectCategory(null)}
        className={`badge cursor-pointer transition-all ${
          selectedCategoryId === null ? 'ring-2 ring-blue-500' : 'hover:bg-gray-200'
        }`}
      >
        All Notes
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`badge cursor-pointer transition-all ${
            selectedCategoryId === category.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;