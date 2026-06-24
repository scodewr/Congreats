package com.congreats.application.usecase;

import com.congreats.application.port.out.CategoryRepository;
import com.congreats.domain.model.Category;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class ListCategoriesUseCase {

    @Inject CategoryRepository categoryRepository;

    public List<Category> execute() {
        return categoryRepository.findAllActive();
    }

    public List<Category> search(String q, int limit) {
        return categoryRepository.searchByName(q, limit);
    }
}
