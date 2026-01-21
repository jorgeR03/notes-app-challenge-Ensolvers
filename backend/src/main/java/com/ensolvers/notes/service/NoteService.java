package com.ensolvers.notes.service;

import com.ensolvers.notes.dto.CategoryDTO;
import com.ensolvers.notes.dto.NoteDTO;
import com.ensolvers.notes.dto.NoteRequestDTO;
import com.ensolvers.notes.exception.ResourceNotFoundException;
import com.ensolvers.notes.model.Category;
import com.ensolvers.notes.model.Note;
import com.ensolvers.notes.repository.CategoryRepository;
import com.ensolvers.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public List<NoteDTO> getAllActiveNotes() {
        log.debug("Fetching all active notes");
        return noteRepository.findByArchivedWithCategories(false)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NoteDTO> getAllArchivedNotes() {
        log.debug("Fetching all archived notes");
        return noteRepository.findByArchivedWithCategories(true)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NoteDTO> getNotesByCategoryId(Long categoryId) {
        log.debug("Fetching notes by category id: {}", categoryId);
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return noteRepository.findActiveByCategoryId(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NoteDTO getNoteById(Long id) {
        log.debug("Fetching note with id: {}", id);
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        return convertToDTO(note);
    }

    public NoteDTO createNote(NoteRequestDTO noteRequest) {
        log.debug("Creating new note with title: {}", noteRequest.getTitle());
        Note note = new Note();
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setArchived(noteRequest.getArchived() != null ? noteRequest.getArchived() : false);

        if (noteRequest.getCategoryIds() != null && !noteRequest.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(
                    categoryRepository.findAllById(noteRequest.getCategoryIds())
            );
            note.setCategories(categories);
        }

        Note savedNote = noteRepository.save(note);
        log.info("Note created successfully with id: {}", savedNote.getId());
        return convertToDTO(savedNote);
    }

    public NoteDTO updateNote(Long id, NoteRequestDTO noteRequest) {
        log.debug("Updating note with id: {}", id);
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));

        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setArchived(noteRequest.getArchived() != null ? noteRequest.getArchived() : note.getArchived());

        if (noteRequest.getCategoryIds() != null) {
            note.getCategories().clear();
            if (!noteRequest.getCategoryIds().isEmpty()) {
                Set<Category> categories = new HashSet<>(
                        categoryRepository.findAllById(noteRequest.getCategoryIds())
                );
                note.setCategories(categories);
            }
        }

        Note updatedNote = noteRepository.save(note);
        log.info("Note updated successfully with id: {}", id);
        return convertToDTO(updatedNote);
    }

    public void deleteNote(Long id) {
        log.debug("Deleting note with id: {}", id);
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
        log.info("Note deleted successfully with id: {}", id);
    }

    public NoteDTO archiveNote(Long id) {
        log.debug("Archiving note with id: {}", id);
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setArchived(true);
        Note archivedNote = noteRepository.save(note);
        log.info("Note archived successfully with id: {}", id);
        return convertToDTO(archivedNote);
    }

    public NoteDTO unarchiveNote(Long id) {
        log.debug("Unarchiving note with id: {}", id);
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setArchived(false);
        Note unarchivedNote = noteRepository.save(note);
        log.info("Note unarchived successfully with id: {}", id);
        return convertToDTO(unarchivedNote);
    }

    public NoteDTO addCategoriesToNote(Long noteId, Set<Long> categoryIds) {
        log.debug("Adding categories to note with id: {}", noteId);
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));

        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(categoryIds));
        note.getCategories().addAll(categories);

        Note updatedNote = noteRepository.save(note);
        log.info("Categories added to note with id: {}", noteId);
        return convertToDTO(updatedNote);
    }

    public NoteDTO removeCategoryFromNote(Long noteId, Long categoryId) {
        log.debug("Removing category {} from note with id: {}", categoryId, noteId);
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        note.removeCategory(category);

        Note updatedNote = noteRepository.save(note);
        log.info("Category removed from note with id: {}", noteId);
        return convertToDTO(updatedNote);
    }

    private NoteDTO convertToDTO(Note note) {
        NoteDTO dto = new NoteDTO();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setArchived(note.getArchived());
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());

        if (note.getCategories() != null) {
            Set<CategoryDTO> categoryDTOs = note.getCategories().stream()
                    .map(cat -> new CategoryDTO(cat.getId(), cat.getName()))
                    .collect(Collectors.toSet());
            dto.setCategories(categoryDTOs);
        }

        return dto;
    }
}