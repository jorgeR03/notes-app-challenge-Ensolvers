package com.ensolvers.notes.repository;

import com.ensolvers.notes.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByArchivedFalseOrderByUpdatedAtDesc();

    List<Note> findByArchivedTrueOrderByUpdatedAtDesc();

    @Query("SELECT DISTINCT n FROM Note n LEFT JOIN FETCH n.categories WHERE n.archived = :archived ORDER BY n.updatedAt DESC")
    List<Note> findByArchivedWithCategories(@Param("archived") Boolean archived);

    @Query("SELECT DISTINCT n FROM Note n JOIN n.categories c WHERE c.id = :categoryId AND n.archived = false ORDER BY n.updatedAt DESC")
    List<Note> findActiveByCategoryId(@Param("categoryId") Long categoryId);
}