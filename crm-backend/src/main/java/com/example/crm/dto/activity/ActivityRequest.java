package com.example.crm.dto.activity;

import com.example.crm.entity.enums.ActivityStatus;
import com.example.crm.entity.enums.ActivityType;
import com.example.crm.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class ActivityRequest {
    @NotNull
    private ActivityType type;
    @NotBlank
    private String subject;
    private String description;
    private UUID customerId;
    private UUID leadId;
    private UUID dealId;
    private UUID assignedToId;
    private Instant dueDate;
    private Instant startTime;
    private Instant endTime;
    private Priority priority;
    private ActivityStatus status;
}
