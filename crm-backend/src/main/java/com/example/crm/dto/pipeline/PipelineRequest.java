package com.example.crm.dto.pipeline;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PipelineRequest {
    @NotBlank
    private String name;
    private String description;
    private Boolean active;
}
