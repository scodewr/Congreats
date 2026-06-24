package com.congreats.infrastructure.adapter.in;

import com.congreats.application.usecase.ListCategoriesUseCase;
import com.congreats.domain.model.Category;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
public class CategoryController {

    @Inject ListCategoriesUseCase listCategories;

    @GET
    public List<Category> list(@QueryParam("q") @DefaultValue("") String q,
                               @QueryParam("limit") @DefaultValue("10") int limit) {
        return q.isBlank() ? listCategories.execute() : listCategories.search(q, limit);
    }
}
