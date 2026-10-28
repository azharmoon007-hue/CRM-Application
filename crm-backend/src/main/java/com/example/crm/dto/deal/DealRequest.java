package com.example.crm.dto.deal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class DealRequest {
    @NotBlank
    private String name;
    private UUID customerId;
    private UUID leadId;
    private UUID assignedToId;
    @NotNull
    private UUID pipelineId;
    private UUID stageId;
    @PositiveOrZero
    private BigDecimal amount;
    private String currency;
    @PositiveOrZero
    private Integer probability;
    private LocalDate expectedCloseDate;
    private String description;
}
