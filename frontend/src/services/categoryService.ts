import api from './api';
import type { Category, CategoryRequest } from '../types';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (category: CategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};