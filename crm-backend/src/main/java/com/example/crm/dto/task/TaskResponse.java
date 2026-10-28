package com.example.crm.dto.task;

import com.example.crm.entity.enums.Priority;
import com.example.crm.entity.enums.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private UUID assignedToId;
    private String assignedToName;
    private Priority priority;
    private Instant dueDate;
    private TaskStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
