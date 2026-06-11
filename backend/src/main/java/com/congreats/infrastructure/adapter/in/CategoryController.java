package com.congreats.infrastructure.adapter.in;

import com.congreats.application.usecase.ListCategoriesUseCase;
import com.congreats.domain.model.Category;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
public class CategoryController {

    @Inject ListCategoriesUseCase listCategories;

    @GET
    public List<Category> list() {
        return listCategories.execute();
    }
}
