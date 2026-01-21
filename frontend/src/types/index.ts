export interface Category {
  id: number;
  name: string;
  createdAt?: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteRequest {
  title: string;
  content: string;
  archived?: boolean;
  categoryIds?: number[];
}

export interface CategoryRequest {
  name: string;
}