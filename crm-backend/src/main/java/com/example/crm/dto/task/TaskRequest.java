package com.example.crm.dto.task;

import com.example.crm.entity.enums.Priority;
import com.example.crm.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private UUID assignedToId;
    private UUID customerId;
    private UUID leadId;
    private UUID dealId;
    private Priority priority;
    private Instant dueDate;
    private TaskStatus status;
}
