package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.ProfileRepository;
import com.congreats.domain.model.Profile;
import com.congreats.infrastructure.entity.ProfileEntity;
import com.congreats.infrastructure.entity.ProfileProjectEntity;
import com.congreats.infrastructure.entity.ProfileTeamEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ProfileRepositoryJPA implements PanacheRepository<ProfileEntity>, ProfileRepository {

    @Override
    public void save(Profile profile) {
        ProfileEntity entity = ProfileEntity.from(profile);
        entity.projects = new ArrayList<>(
                profile.projects().stream().map(p -> ProfileProjectEntity.from(p, entity)).toList());
        entity.teams = new ArrayList<>(
                profile.teams().stream().map(t -> ProfileTeamEntity.from(t, entity)).toList());
        persist(entity);
    }

    @Override
    public void update(Profile profile) {
        ProfileEntity entity = find("id", profile.id()).firstResult();
        if (entity == null) { save(profile); return; }
        entity.bio = profile.bio();
        entity.jobTitle = profile.jobTitle();
        entity.company = profile.company();
        entity.photoUrl = profile.photoUrl();
        entity.projects.clear();
        entity.projects.addAll(
                profile.projects().stream().map(p -> ProfileProjectEntity.from(p, entity)).toList());
        entity.teams.clear();
        entity.teams.addAll(
                profile.teams().stream().map(t -> ProfileTeamEntity.from(t, entity)).toList());
    }

    @Override
    public Optional<Profile> findByUserId(UUID userId) {
        return find("userId", userId).firstResultOptional().map(ProfileEntity::toDomain);
    }
}
