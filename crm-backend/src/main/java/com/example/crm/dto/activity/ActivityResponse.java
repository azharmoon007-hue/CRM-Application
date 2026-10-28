package com.example.crm.dto.activity;

import com.example.crm.entity.enums.ActivityStatus;
import com.example.crm.entity.enums.ActivityType;
import com.example.crm.entity.enums.Priority;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class ActivityResponse {
    private UUID id;
    private ActivityType type;
    private String subject;
    private String description;
    private UUID customerId;
    private UUID leadId;
    private UUID dealId;
    private UUID assignedToId;
    private String assignedToName;
    private Instant dueDate;
    private Instant startTime;
    private Instant endTime;
    private Priority priority;
    private ActivityStatus status;
    private Instant completedAt;
    private Instant createdAt;
}
