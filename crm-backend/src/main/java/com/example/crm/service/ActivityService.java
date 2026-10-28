package com.example.crm.service;

import com.example.crm.dto.activity.ActivityRequest;
import com.example.crm.dto.activity.ActivityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ActivityService {
    Page<ActivityResponse> findAll(String search, Pageable pageable);
    ActivityResponse findById(UUID id);
    ActivityResponse create(ActivityRequest request);
    ActivityResponse update(UUID id, ActivityRequest request);
    void delete(UUID id);
}
