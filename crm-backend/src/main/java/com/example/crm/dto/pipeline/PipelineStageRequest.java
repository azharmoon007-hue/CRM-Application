package com.example.crm.dto.pipeline;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PipelineStageRequest {
    @NotBlank
    private String name;
    @NotNull
    private Integer sequence;
    @NotNull
    @PositiveOrZero
    private Integer probability;
    private String color;
    private Boolean active;
}
