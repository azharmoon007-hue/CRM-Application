package com.example.crm.service;

import com.example.crm.dto.common.AssignRequest;
import com.example.crm.dto.lead.*;
import com.example.crm.entity.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LeadService {
    Page<LeadResponse> findAll(String search, LeadStatus status, Pageable pageable);
    LeadResponse findById(UUID id);
    LeadResponse create(LeadRequest request);
    LeadResponse update(UUID id, LeadRequest request);
    void delete(UUID id);
    LeadResponse qualify(UUID id);
    LeadResponse convert(UUID id, ConvertLeadRequest request);
    LeadResponse assign(UUID id, AssignRequest request);
    LeadResponse updateStatus(UUID id, LeadStatusUpdateRequest request);
}
