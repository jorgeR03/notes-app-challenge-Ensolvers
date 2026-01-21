import api from './api';
import type { Note, NoteRequest } from '../types';

export const noteService = {
  getActiveNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes/active');
    return response.data;
  },

  getArchivedNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes/archived');
    return response.data;
  },

  getNotesByCategory: async (categoryId: number): Promise<Note[]> => {
    const response = await api.get(`/notes/category/${categoryId}`);
    return response.data;
  },

  createNote: async (note: NoteRequest): Promise<Note> => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id: number, note: NoteRequest): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  archiveNote: async (id: number): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },

  unarchiveNote: async (id: number): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/unarchive`);
    return response.data;
  },

  removeCategoryFromNote: async (noteId: number, categoryId: number): Promise<Note> => {
    const response = await api.delete(`/notes/${noteId}/categories/${categoryId}`);
    return response.data;
  },
};