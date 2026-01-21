import { useState, useEffect } from 'react';
import type { Note, Category, NoteRequest } from '../types';

interface NoteFormProps {
  note: Note | null;
  categories: Category[];
  onSubmit: (note: NoteRequest) => void;
  onCancel: () => void;
}

const NoteForm = ({ note, categories, onSubmit, onCancel }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    if (note) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(note.title);
      setContent(note.content || '');
      setSelectedCategories(note.categories?.map((cat) => cat.id) || []);
    } else {
      setTitle('');
      setContent('');
      setSelectedCategories([]);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      archived: note?.archived || false,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {note ? 'Edit Note' : 'Create New Note'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Enter note title"
            maxLength={255}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea-field"
            placeholder="Enter note content (optional)"
            rows={6}
          />
        </div>

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`badge cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'ring-2 ring-blue-500'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            {note ? 'Update Note' : 'Create Note'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;