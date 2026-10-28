package com.example.crm.dto.audit;

import com.example.crm.entity.enums.AuditAction;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class AuditLogResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private AuditAction action;
    private String entityName;
    private String entityId;
    private String ipAddress;
    private Instant timestamp;
}
