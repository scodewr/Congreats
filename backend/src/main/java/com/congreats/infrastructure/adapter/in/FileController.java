package com.congreats.infrastructure.adapter.in;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Path("/files")
public class FileController {

    @Inject
    @ConfigProperty(name = "congreats.storage.path", defaultValue = "./uploads/photos")
    String storagePath;

    @GET
    @Path("/{filename}")
    public Response serve(@PathParam("filename") String filename) throws IOException {
        java.nio.file.Path file = Paths.get(storagePath).resolve(filename).normalize();
        if (!file.startsWith(Paths.get(storagePath))) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        if (!Files.exists(file)) return Response.status(Response.Status.NOT_FOUND).build();

        String mimeType = filename.endsWith(".png") ? "image/png" : "image/jpeg";
        StreamingOutput stream = out -> Files.copy(file, out);
        return Response.ok(stream).type(mimeType).build();
    }
}
