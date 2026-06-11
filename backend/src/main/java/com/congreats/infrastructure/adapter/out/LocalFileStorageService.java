package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.FileStorageService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@ApplicationScoped
public class LocalFileStorageService implements FileStorageService {

    @Inject
    @ConfigProperty(name = "congreats.storage.path", defaultValue = "./uploads/photos")
    String storagePath;

    @Inject
    @ConfigProperty(name = "congreats.storage.base-url", defaultValue = "http://localhost:8080/files")
    String baseUrl;

    @Override
    public String store(byte[] content, String filename, String mimeType) throws IOException {
        String ext = filename.contains(".") ? filename.substring(filename.lastIndexOf('.')) : ".jpg";
        String uniqueName = UUID.randomUUID() + ext;
        Path dir = Paths.get(storagePath);
        Files.createDirectories(dir);
        Files.write(dir.resolve(uniqueName), content);
        return baseUrl + "/" + uniqueName;
    }

    @Override
    public void delete(String url) throws IOException {
        if (url == null || !url.startsWith(baseUrl)) return;
        String filename = url.substring(url.lastIndexOf('/') + 1);
        Files.deleteIfExists(Paths.get(storagePath).resolve(filename));
    }
}
