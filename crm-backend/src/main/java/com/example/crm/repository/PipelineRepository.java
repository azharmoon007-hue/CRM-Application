package com.example.crm.repository;

import com.example.crm.entity.Pipeline;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PipelineRepository extends JpaRepository<Pipeline, UUID> {
    @EntityGraph(attributePaths = "stages")
    List<Pipeline> findAll();

    @EntityGraph(attributePaths = "stages")
    Optional<Pipeline> findWithStagesById(UUID id);

    Optional<Pipeline> findFirstByActiveTrueOrderByCreatedAtAsc();
}
