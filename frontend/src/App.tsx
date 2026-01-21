import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from './services/noteService';
import { categoryService } from './services/categoryService';
import type { Note, NoteRequest, CategoryRequest } from './types';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import CategoryManager from './components/CategoryManager';
import CategoryFilter from './components/CategoryFilter';

function App() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Queries
  const { data: activeNotes = [], isLoading: loadingActive } = useQuery({
    queryKey: ['notes', 'active'],
    queryFn: noteService.getActiveNotes,
    enabled: !showArchived && selectedCategoryId === null,
  });

  const { data: archivedNotes = [], isLoading: loadingArchived } = useQuery({
    queryKey: ['notes', 'archived'],
    queryFn: noteService.getArchivedNotes,
    enabled: showArchived,
  });

  const { data: filteredNotes = [], isLoading: loadingFiltered } = useQuery({
    queryKey: ['notes', 'category', selectedCategoryId],
    queryFn: () => noteService.getNotesByCategory(selectedCategoryId!),
    enabled: selectedCategoryId !== null,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  // Mutations
  const createNoteMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setShowForm(false);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note: NoteRequest }) =>
      noteService.updateNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
      setShowForm(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const archiveNoteMutation = useMutation({
    mutationFn: noteService.archiveNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const unarchiveNoteMutation = useMutation({
    mutationFn: noteService.unarchiveNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const removeCategoryMutation = useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: number; categoryId: number }) =>
      noteService.removeCategoryFromNote(noteId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Handlers
  const handleCreateOrUpdate = (note: NoteRequest) => {
    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote.id, note });
    } else {
      createNoteMutation.mutate(note);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleArchive = (id: number) => {
    archiveNoteMutation.mutate(id);
  };

  const handleUnarchive = (id: number) => {
    unarchiveNoteMutation.mutate(id);
  };

  const handleRemoveCategory = (noteId: number, categoryId: number) => {
    removeCategoryMutation.mutate({ noteId, categoryId });
  };

  const handleCreateCategory = (category: CategoryRequest) => {
    createCategoryMutation.mutate(category);
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setShowArchived(false);
  };

  // Determine which notes to display
  const displayNotes =
    selectedCategoryId !== null
      ? filteredNotes
      : showArchived
      ? archivedNotes
      : activeNotes;

  const isLoading = loadingActive || loadingArchived || loadingFiltered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 Notes App</h1>
          <p className="text-gray-600">Organize your thoughts with categories</p>
        </header>

        <div className="mb-6">
          <CategoryManager
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingNote(null);
                }}
                className="btn-primary"
              >
                + New Note
              </button>
              <button
                onClick={() => {
                  setShowArchived(!showArchived);
                  setSelectedCategoryId(null);
                }}
                className={`btn-secondary ${
                  showArchived ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </button>
            </div>

            {!showArchived && categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={handleCategoryFilter}
              />
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <NoteForm
              note={editingNote}
              categories={categories}
              onSubmit={handleCreateOrUpdate}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        ) : displayNotes.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500 text-lg">
              {showArchived
                ? 'No archived notes yet'
                : selectedCategoryId !== null
                ? 'No notes in this category'
                : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onRemoveCategory={handleRemoveCategory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;