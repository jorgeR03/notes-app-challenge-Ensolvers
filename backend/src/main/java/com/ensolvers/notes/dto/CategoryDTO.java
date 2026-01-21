package com.ensolvers.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {

    private Long id;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must be less than 100 characters")
    private String name;

    private LocalDateTime createdAt;

    public CategoryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}