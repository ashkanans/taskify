package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.Category;
import com.ashkanans.taskify.model.Tag;
import com.ashkanans.taskify.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category getTagByName(String name) {
        return categoryRepository.findByName(name);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public List<Category> getAllCategories() { return categoryRepository.findAll(); }

    public Category saveCategory(Category category) {  return this.categoryRepository.save(category); }

    public Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }
}
