package com.example.crm.service.impl;

import com.example.crm.dto.pipeline.*;
import com.example.crm.entity.Pipeline;
import com.example.crm.entity.PipelineStage;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.PipelineMapper;
import com.example.crm.repository.PipelineRepository;
import com.example.crm.repository.PipelineStageRepository;
import com.example.crm.service.PipelineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PipelineServiceImpl implements PipelineService {
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final PipelineMapper mapper;

    public PipelineServiceImpl(PipelineRepository pipelineRepository, PipelineStageRepository pipelineStageRepository,
                              PipelineMapper mapper) {
        this.pipelineRepository = pipelineRepository;
        this.pipelineStageRepository = pipelineStageRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PipelineResponse> findAll() {
        return pipelineRepository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PipelineResponse findById(UUID id) {
        return pipelineRepository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found", "PIPELINE_NOT_FOUND"));
    }

    @Override
    public PipelineResponse create(PipelineRequest request) {
        Pipeline pipeline = mapper.toEntity(request);
        if (pipeline.getActive() == null) {
            pipeline.setActive(true);
        }
        return mapper.toResponse(pipelineRepository.save(pipeline));
    }

    @Override
    public PipelineResponse update(UUID id, PipelineRequest request) {
        Pipeline pipeline = pipelineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found", "PIPELINE_NOT_FOUND"));
        pipeline.setName(request.getName() != null ? request.getName() : pipeline.getName());
        pipeline.setDescription(request.getDescription() != null ? request.getDescription() : pipeline.getDescription());
        if (request.getActive() != null) {
            pipeline.setActive(request.getActive());
        }
        return mapper.toResponse(pipelineRepository.save(pipeline));
    }

    @Override
    public void delete(UUID id) {
        if (!pipelineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pipeline not found", "PIPELINE_NOT_FOUND");
        }
        pipelineRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PipelineStageResponse> getStages(UUID pipelineId) {
        return pipelineStageRepository.findByPipelineIdOrderBySequenceAsc(pipelineId).stream()
                .map(mapper::toStageResponse).collect(Collectors.toList());
    }

    @Override
    public PipelineStageResponse addStage(UUID pipelineId, PipelineStageRequest request) {
        Pipeline pipeline = pipelineRepository.findById(pipelineId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found", "PIPELINE_NOT_FOUND"));
        PipelineStage stage = mapper.toStageEntity(request);
        stage.setPipeline(pipeline);
        if (stage.getActive() == null) {
            stage.setActive(true);
        }
        return mapper.toStageResponse(pipelineStageRepository.save(stage));
    }

    @Override
    public PipelineStageResponse updateStage(UUID stageId, PipelineStageRequest request) {
        PipelineStage stage = pipelineStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage not found", "STAGE_NOT_FOUND"));
        stage.setName(request.getName() != null ? request.getName() : stage.getName());
        stage.setSequence(request.getSequence() != null ? request.getSequence() : stage.getSequence());
        stage.setProbability(request.getProbability() != null ? request.getProbability() : stage.getProbability());
        stage.setColor(request.getColor() != null ? request.getColor() : stage.getColor());
        if (request.getActive() != null) {
            stage.setActive(request.getActive());
        }
        return mapper.toStageResponse(pipelineStageRepository.save(stage));
    }

    @Override
    public void deleteStage(UUID stageId) {
        if (!pipelineStageRepository.existsById(stageId)) {
            throw new ResourceNotFoundException("Stage not found", "STAGE_NOT_FOUND");
        }
        pipelineStageRepository.deleteById(stageId);
    }
}
