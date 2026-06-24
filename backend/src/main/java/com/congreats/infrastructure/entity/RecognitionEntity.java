package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Recognition;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "recognitions",
       indexes = {
           @Index(name = "idx_recognitions_recognized", columnList = "recognized_id"),
           @Index(name = "idx_recognitions_recognizer", columnList = "recognizer_id")
       })
public class RecognitionEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "recognizer_id", nullable = false, columnDefinition = "uuid")
    public UUID recognizerId;

    @Column(name = "recognized_id", nullable = false, columnDefinition = "uuid")
    public UUID recognizedId;

    @Column(name = "category_id", nullable = false, columnDefinition = "uuid")
    public UUID categoryId;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String testimonial;

    @Column(name = "project_id", columnDefinition = "uuid")
    public UUID projectId;

    @Column(name = "team_id", columnDefinition = "uuid")
    public UUID teamId;

    @Column(name = "workspace_id", columnDefinition = "uuid")
    public UUID workspaceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recognition_skills",
            joinColumns = @JoinColumn(name = "recognition_id"))
    @Column(name = "skill", length = 100)
    public List<String> skills;

    public static RecognitionEntity from(Recognition r) {
        RecognitionEntity e = new RecognitionEntity();
        e.id = r.id();
        e.recognizerId = r.recognizerId();
        e.recognizedId = r.recognizedId();
        e.categoryId = r.categoryId();
        e.testimonial = r.testimonial();
        e.projectId = r.projectId();
        e.teamId = r.teamId();
        e.workspaceId = r.workspaceId();
        e.createdAt = r.createdAt();
        e.skills = r.skills();
        return e;
    }

    public Recognition toDomain() {
        return new Recognition(id, recognizerId, recognizedId, categoryId,
                skills, testimonial, projectId, teamId, workspaceId, createdAt);
    }
}
