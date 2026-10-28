package com.example.crm.mapper;

import com.example.crm.dto.pipeline.PipelineRequest;
import com.example.crm.dto.pipeline.PipelineResponse;
import com.example.crm.dto.pipeline.PipelineStageRequest;
import com.example.crm.dto.pipeline.PipelineStageResponse;
import com.example.crm.entity.Pipeline;
import com.example.crm.entity.PipelineStage;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PipelineMapper {
    PipelineResponse toResponse(Pipeline pipeline);
    PipelineStageResponse toStageResponse(PipelineStage stage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Pipeline toEntity(PipelineRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pipeline", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PipelineStage toStageEntity(PipelineStageRequest request);
}
