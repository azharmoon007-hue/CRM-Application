package com.example.crm.dto.lead;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ConvertLeadRequest {
    @NotNull
    private UUID pipelineId;
    @NotNull
    private UUID stageId;
    private BigDecimal dealAmount;
    private String dealName;
}
