import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
  onRemoveCategory: (noteId: number, categoryId: number) => void;
}

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onRemoveCategory,
}: NoteCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex-1">{note.title}</h3>
        {note.archived && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded ml-2">
            Archived
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">
        {note.content || <span className="italic text-gray-400">No content</span>}
      </p>

      {note.categories && note.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.categories.map((category) => (
            <span key={category.id} className="badge flex items-center gap-1">
              {category.name}
              <button
                onClick={() => onRemoveCategory(note.id, category.id)}
                className="ml-1 hover:text-red-600 transition-colors"
                title="Remove category"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>Created: {formatDate(note.createdAt)}</div>
          <div>Updated: {formatDate(note.updatedAt)}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Edit
          </button>
          {note.archived ? (
            <button onClick={() => onUnarchive(note.id)} className="btn-primary text-sm">
              Unarchive
            </button>
          ) : (
            <button
              onClick={() => onArchive(note.id)}
              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
            >
              Archive
            </button>
          )}
          <button onClick={() => onDelete(note.id)} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;