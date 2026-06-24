package com.congreats.application.port.out;

import com.congreats.domain.model.Recognition;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface RecognitionRepository {
    void save(Recognition recognition);
    List<Recognition> findByRecognizedId(UUID userId, int page, int size);
    List<Recognition> findByRecognizerId(UUID userId, int page, int size);
    long countByRecognizedId(UUID userId);
    Map<String, Long> countSkillsByRecognizedId(UUID userId);
    List<Recognition> findRecent(int page, int size);
    long countAll();
    List<Recognition> findByWorkspaceId(UUID workspaceId, int page, int size);
    long countByWorkspaceId(UUID workspaceId);
    List<UUID> findTopRecognizedIds(int page, int size);
    long countDistinctRecognized();
}
