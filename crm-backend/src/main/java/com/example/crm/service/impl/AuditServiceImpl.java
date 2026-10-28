package com.example.crm.service.impl;

import com.example.crm.dto.audit.AuditLogResponse;
import com.example.crm.entity.AuditLog;
import com.example.crm.entity.User;
import com.example.crm.entity.enums.AuditAction;
import com.example.crm.mapper.AuditMapper;
import com.example.crm.repository.AuditLogRepository;
import com.example.crm.repository.UserRepository;
import com.example.crm.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class AuditServiceImpl implements AuditService {
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final AuditMapper mapper;

    public AuditServiceImpl(AuditLogRepository auditLogRepository, UserRepository userRepository, AuditMapper mapper) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> findAll(Pageable pageable) {
        return auditLogRepository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public void log(UUID userId, AuditAction action, String entityName, String entityId, String oldValue, String newValue, String ipAddress) {
        AuditLog log = new AuditLog();
        if (userId != null) {
            userRepository.findById(userId).ifPresent(log::setUser);
        }
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setIpAddress(ipAddress);
        log.setTimestamp(Instant.now());
        auditLogRepository.save(log);
    }
}
