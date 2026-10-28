package com.example.crm.mapper;

import com.example.crm.dto.audit.AuditLogResponse;
import com.example.crm.entity.AuditLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuditMapper {
    @Mapping(target = "userName", expression = "java(audit.getUser() != null ? audit.getUser().getFullName() : null)")
    AuditLogResponse toResponse(AuditLog audit);
}
