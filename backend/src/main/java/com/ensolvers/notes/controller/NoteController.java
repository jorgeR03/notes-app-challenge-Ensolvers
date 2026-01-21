package com.ensolvers.notes.controller;

import com.ensolvers.notes.dto.NoteDTO;
import com.ensolvers.notes.dto.NoteRequestDTO;
import com.ensolvers.notes.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteService noteService;

    @GetMapping("/active")
    public ResponseEntity<List<NoteDTO>> getAllActiveNotes() {
        log.info("GET /api/notes/active - Fetching all active notes");
        List<NoteDTO> notes = noteService.getAllActiveNotes();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<NoteDTO>> getAllArchivedNotes() {
        log.info("GET /api/notes/archived - Fetching all archived notes");
        List<NoteDTO> notes = noteService.getAllArchivedNotes();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<NoteDTO>> getNotesByCategory(@PathVariable Long categoryId) {
        log.info("GET /api/notes/category/{} - Fetching notes by category", categoryId);
        List<NoteDTO> notes = noteService.getNotesByCategoryId(categoryId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getNoteById(@PathVariable Long id) {
        log.info("GET /api/notes/{} - Fetching note by id", id);
        NoteDTO note = noteService.getNoteById(id);
        return ResponseEntity.ok(note);
    }

    @PostMapping
    public ResponseEntity<NoteDTO> createNote(@Valid @RequestBody NoteRequestDTO noteRequest) {
        log.info("POST /api/notes - Creating new note");
        NoteDTO createdNote = noteService.createNote(noteRequest);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequestDTO noteRequest) {
        log.info("PUT /api/notes/{} - Updating note", id);
        NoteDTO updatedNote = noteService.updateNote(id, noteRequest);
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        log.info("DELETE /api/notes/{} - Deleting note", id);
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<NoteDTO> archiveNote(@PathVariable Long id) {
        log.info("PATCH /api/notes/{}/archive - Archiving note", id);
        NoteDTO archivedNote = noteService.archiveNote(id);
        return ResponseEntity.ok(archivedNote);
    }

    @PatchMapping("/{id}/unarchive")
    public ResponseEntity<NoteDTO> unarchiveNote(@PathVariable Long id) {
        log.info("PATCH /api/notes/{}/unarchive - Unarchiving note", id);
        NoteDTO unarchivedNote = noteService.unarchiveNote(id);
        return ResponseEntity.ok(unarchivedNote);
    }

    @PostMapping("/{noteId}/categories")
    public ResponseEntity<NoteDTO> addCategoriesToNote(
            @PathVariable Long noteId,
            @RequestBody Set<Long> categoryIds) {
        log.info("POST /api/notes/{}/categories - Adding categories to note", noteId);
        NoteDTO updatedNote = noteService.addCategoriesToNote(noteId, categoryIds);
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/{noteId}/categories/{categoryId}")
    public ResponseEntity<NoteDTO> removeCategoryFromNote(
            @PathVariable Long noteId,
            @PathVariable Long categoryId) {
        log.info("DELETE /api/notes/{}/categories/{} - Removing category from note", noteId, categoryId);
        NoteDTO updatedNote = noteService.removeCategoryFromNote(noteId, categoryId);
        return ResponseEntity.ok(updatedNote);
    }
}