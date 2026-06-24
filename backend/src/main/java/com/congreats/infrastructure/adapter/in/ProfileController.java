package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.AchievementsView;
import com.congreats.application.dto.ProfileView;
import com.congreats.application.usecase.GetProfileUseCase;
import com.congreats.application.usecase.GetUserAchievementsUseCase;
import com.congreats.application.usecase.SearchUsersUseCase;
import com.congreats.application.usecase.UpdateProfileUseCase;
import com.congreats.application.usecase.UploadProfilePhotoUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.UUID;

@Path("/profiles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileController {

    @Inject GetProfileUseCase getProfile;
    @Inject UpdateProfileUseCase updateProfile;
    @Inject UploadProfilePhotoUseCase uploadPhoto;
    @Inject SearchUsersUseCase searchUsers;
    @Inject GetUserAchievementsUseCase getUserAchievements;
    @Inject RequestContext requestContext;

    @GET
    public List<ProfileView> list(@QueryParam("q") @DefaultValue("") String q,
                                  @QueryParam("page") @DefaultValue("0") int page,
                                  @QueryParam("size") @DefaultValue("20") int size) {
        return searchUsers.execute(q, page, size);
    }

    @GET
    @Path("/me")
    public ProfileView getOwnProfile() {
        return getProfile.execute(requestContext.getUserId());
    }

    @GET
    @Path("/{userId}")
    public ProfileView getById(@PathParam("userId") UUID userId) {
        return getProfile.execute(userId);
    }

    @GET
    @Path("/{userId}/achievements")
    public AchievementsView getAchievements(@PathParam("userId") UUID userId) {
        return getUserAchievements.execute(userId);
    }

    @PUT
    @Path("/{userId}")
    public ProfileView update(@PathParam("userId") UUID userId,
                              @Valid UpdateProfileRequest req) {
        return updateProfile.execute(new UpdateProfileUseCase.Command(
                requestContext.getUserId(), userId,
                req.bio(), req.jobTitle(), req.company(), req.projects(), req.teams()));
    }

    @POST
    @Path("/{userId}/photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadPhoto(@PathParam("userId") UUID userId,
                                @RestForm("file") FileUpload file) throws IOException {
        byte[] bytes = Files.readAllBytes(file.filePath());
        String url = uploadPhoto.execute(new UploadProfilePhotoUseCase.Command(
                requestContext.getUserId(), userId, bytes,
                file.contentType(), file.fileName()));
        return Response.ok().entity(java.util.Map.of("photoUrl", url)).build();
    }

    public record UpdateProfileRequest(
            String bio, String jobTitle, String company,
            List<UpdateProfileUseCase.ProjectInput> projects,
            List<UpdateProfileUseCase.TeamInput> teams) {}
}
