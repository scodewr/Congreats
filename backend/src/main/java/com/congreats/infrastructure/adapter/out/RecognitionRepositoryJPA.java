package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.domain.model.Recognition;
import com.congreats.infrastructure.entity.RecognitionEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.inject.Inject;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class RecognitionRepositoryJPA implements PanacheRepository<RecognitionEntity>, RecognitionRepository {

    @Inject EntityManager em;

    @Override
    public void save(Recognition recognition) {
        persist(RecognitionEntity.from(recognition));
    }

    @Override
    public List<Recognition> findByRecognizedId(UUID userId, int page, int size) {
        return find("recognizedId = ?1 order by createdAt desc", userId)
                .page(page, size).list().stream().map(RecognitionEntity::toDomain).toList();
    }

    @Override
    public List<Recognition> findByRecognizerId(UUID userId, int page, int size) {
        return find("recognizerId = ?1 order by createdAt desc", userId)
                .page(page, size).list().stream().map(RecognitionEntity::toDomain).toList();
    }

    @Override
    public long countByRecognizedId(UUID userId) {
        return count("recognizedId", userId);
    }

    @Override
    public Map<String, Long> countSkillsByRecognizedId(UUID userId) {
        List<Object[]> rows = em.createQuery(
                "SELECT rs, COUNT(rs) FROM RecognitionEntity r JOIN r.skills rs " +
                "WHERE r.recognizedId = :uid GROUP BY rs ORDER BY COUNT(rs) DESC",
                Object[].class)
                .setParameter("uid", userId)
                .getResultList();

        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            result.put((String) row[0], (Long) row[1]);
        }
        return result;
    }

    @Override
    public List<Recognition> findRecent(int page, int size) {
        return findAll(io.quarkus.panache.common.Sort.by("createdAt", io.quarkus.panache.common.Sort.Direction.Descending))
                .page(page, size).list().stream().map(RecognitionEntity::toDomain).toList();
    }

    @Override
    public long countAll() {
        return count();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<UUID> findTopRecognizedIds(int page, int size) {
        return em.createQuery(
                "SELECT r.recognizedId FROM RecognitionEntity r GROUP BY r.recognizedId ORDER BY COUNT(r.id) DESC")
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    @Override
    public List<Recognition> findByWorkspaceId(UUID workspaceId, int page, int size) {
        return find("workspaceId = ?1 order by createdAt desc", workspaceId)
                .page(page, size).list().stream().map(RecognitionEntity::toDomain).toList();
    }

    @Override
    public long countByWorkspaceId(UUID workspaceId) {
        return count("workspaceId", workspaceId);
    }

    @Override
    public long countDistinctRecognized() {
        return (long) em.createQuery(
                "SELECT COUNT(DISTINCT r.recognizedId) FROM RecognitionEntity r")
                .getSingleResult();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<UUID, Long> countByRecognizedForEvent(UUID categoryId, Instant startsAt, Instant endsAt) {
        List<Object[]> rows = em.createQuery(
                "SELECT r.recognizedId, COUNT(r.id) FROM RecognitionEntity r " +
                "WHERE r.categoryId = :cat AND r.createdAt >= :start AND r.createdAt < :end " +
                "GROUP BY r.recognizedId ORDER BY COUNT(r.id) DESC")
                .setParameter("cat", categoryId)
                .setParameter("start", startsAt)
                .setParameter("end", endsAt)
                .getResultList();

        Map<UUID, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) result.put((UUID) row[0], (Long) row[1]);
        return result;
    }
}
