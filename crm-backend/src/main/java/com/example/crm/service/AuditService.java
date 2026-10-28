package com.example.crm.service;

import com.example.crm.dto.audit.AuditLogResponse;
import com.example.crm.entity.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AuditService {
    Page<AuditLogResponse> findAll(Pageable pageable);
    void log(UUID userId, AuditAction action, String entityName, String entityId, String oldValue, String newValue, String ipAddress);
}
