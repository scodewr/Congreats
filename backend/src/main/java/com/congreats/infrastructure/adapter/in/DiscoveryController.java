package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.ProfileView;
import com.congreats.application.dto.RecognitionView;
import com.congreats.application.usecase.GetDiscoveryFeedUseCase;
import com.congreats.application.usecase.GetProfessionalRankingUseCase;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/discovery")
@Produces(MediaType.APPLICATION_JSON)
public class DiscoveryController {

    @Inject GetDiscoveryFeedUseCase getFeed;
    @Inject GetProfessionalRankingUseCase getRanking;

    @GET
    @Path("/feed")
    public PageResult<RecognitionView> feed(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return getFeed.execute(page, size);
    }

    @GET
    @Path("/ranking")
    public PageResult<ProfileView> ranking(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return getRanking.execute(page, size);
    }
}
