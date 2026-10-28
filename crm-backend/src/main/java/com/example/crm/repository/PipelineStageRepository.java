package com.example.crm.repository;

import com.example.crm.entity.PipelineStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PipelineStageRepository extends JpaRepository<PipelineStage, UUID> {
    List<PipelineStage> findByPipelineIdOrderBySequenceAsc(UUID pipelineId);
}
