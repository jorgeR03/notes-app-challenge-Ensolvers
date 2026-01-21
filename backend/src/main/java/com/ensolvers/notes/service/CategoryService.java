package com.ensolvers.notes.service;

import com.ensolvers.notes.dto.CategoryDTO;
import com.ensolvers.notes.exception.DuplicateResourceException;
import com.ensolvers.notes.exception.ResourceNotFoundException;
import com.ensolvers.notes.model.Category;
import com.ensolvers.notes.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        log.debug("Fetching all categories");
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        log.debug("Fetching category with id: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        log.debug("Creating new category with name: {}", categoryDTO.getName());

        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + categoryDTO.getName());
        }

        Category category = new Category();
        category.setName(categoryDTO.getName());

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with id: {}", savedCategory.getId());
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        log.debug("Updating category with id: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getName().equals(categoryDTO.getName()) &&
                categoryRepository.existsByName(categoryDTO.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + categoryDTO.getName());
        }

        category.setName(categoryDTO.getName());
        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully with id: {}", id);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(Long id) {
        log.debug("Deleting category with id: {}", id);
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
        log.info("Category deleted successfully with id: {}", id);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setCreatedAt(category.getCreatedAt());
        return dto;
    }
}