package com.example.crm.dto.deal;

import com.example.crm.entity.enums.DealStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class DealResponse {
    private UUID id;
    private String dealCode;
    private String name;
    private UUID customerId;
    private String customerName;
    private UUID leadId;
    private UUID assignedToId;
    private String assignedToName;
    private UUID pipelineId;
    private UUID stageId;
    private String stageName;
    private BigDecimal amount;
    private String currency;
    private Integer probability;
    private LocalDate expectedCloseDate;
    private DealStatus status;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
