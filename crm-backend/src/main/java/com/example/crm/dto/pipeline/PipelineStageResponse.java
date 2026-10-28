package com.example.crm.dto.pipeline;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class PipelineStageResponse {
    private UUID id;
    private UUID pipelineId;
    private String name;
    private Integer sequence;
    private Integer probability;
    private String color;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
