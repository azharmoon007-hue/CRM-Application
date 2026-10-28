package com.example.crm.service;

import com.example.crm.dto.pipeline.*;

import java.util.List;
import java.util.UUID;

public interface PipelineService {
    List<PipelineResponse> findAll();
    PipelineResponse findById(UUID id);
    PipelineResponse create(PipelineRequest request);
    PipelineResponse update(UUID id, PipelineRequest request);
    void delete(UUID id);
    List<PipelineStageResponse> getStages(UUID pipelineId);
    PipelineStageResponse addStage(UUID pipelineId, PipelineStageRequest request);
    PipelineStageResponse updateStage(UUID stageId, PipelineStageRequest request);
    void deleteStage(UUID stageId);
}
