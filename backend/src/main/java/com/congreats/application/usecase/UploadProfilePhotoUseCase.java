package com.congreats.application.usecase;

import com.congreats.application.port.out.FileStorageService;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.ForbiddenException;
import com.congreats.domain.model.Profile;
import java.util.Optional;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@ApplicationScoped
public class UploadProfilePhotoUseCase {

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024L;
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png");

    @Inject ProfileRepository profileRepository;
    @Inject FileStorageService fileStorageService;

    public record Command(UUID requestingUserId, UUID targetUserId,
                          byte[] imageBytes, String mimeType, String filename) {}

    @Transactional
    public String execute(Command cmd) throws IOException {
        if (!cmd.requestingUserId().equals(cmd.targetUserId())) {
            throw new ForbiddenException("Você só pode alterar sua própria foto");
        }
        if (!ALLOWED_TYPES.contains(cmd.mimeType())) {
            throw new DomainException("Tipo de arquivo inválido. Use JPG ou PNG");
        }
        if (cmd.imageBytes().length > MAX_SIZE_BYTES) {
            throw new DomainException("Imagem excede o tamanho máximo de 5MB");
        }

        Optional<Profile> existing = profileRepository.findByUserId(cmd.targetUserId());
        Profile profile = existing.orElse(Profile.createFor(cmd.targetUserId()));

        if (profile.photoUrl() != null) {
            try { fileStorageService.delete(profile.photoUrl()); } catch (IOException ignored) {}
        }

        String url = fileStorageService.store(cmd.imageBytes(), cmd.filename(), cmd.mimeType());
        profile.updatePhoto(url);

        if (existing.isPresent()) {
            profileRepository.update(profile);
        } else {
            profileRepository.save(profile);
        }
        return url;
    }
}
