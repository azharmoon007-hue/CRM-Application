package com.example.crm.service.impl;

import com.example.crm.dto.activity.ActivityRequest;
import com.example.crm.dto.activity.ActivityResponse;
import com.example.crm.entity.Activity;
import com.example.crm.entity.enums.ActivityStatus;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.ActivityMapper;
import com.example.crm.repository.*;
import com.example.crm.service.ActivityService;
import com.example.crm.specification.ActivitySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {
    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final ActivityMapper mapper;
    private final ActivitySpecification specification;

    public ActivityServiceImpl(ActivityRepository activityRepository, CustomerRepository customerRepository,
                              LeadRepository leadRepository, DealRepository dealRepository,
                              UserRepository userRepository, ActivityMapper mapper,
                              ActivitySpecification specification) {
        this.activityRepository = activityRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.specification = specification;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityResponse> findAll(String search, Pageable pageable) {
        return activityRepository.findAll(specification.search(search), pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityResponse findById(UUID id) {
        return activityRepository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found", "ACTIVITY_NOT_FOUND"));
    }

    @Override
    public ActivityResponse create(ActivityRequest request) {
        Activity activity = mapper.toEntity(request);
        if (activity.getStatus() == null) {
            activity.setStatus(ActivityStatus.PENDING);
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(activity::setCustomer);
        }
        if (request.getLeadId() != null) {
            leadRepository.findById(request.getLeadId()).ifPresent(activity::setLead);
        }
        if (request.getDealId() != null) {
            dealRepository.findById(request.getDealId()).ifPresent(activity::setDeal);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(activity::setAssignedTo);
        }
        return mapper.toResponse(activityRepository.save(activity));
    }

    @Override
    public ActivityResponse update(UUID id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found", "ACTIVITY_NOT_FOUND"));
        mapper.update(request, activity);
        if (request.getStatus() == ActivityStatus.COMPLETED && activity.getCompletedAt() == null) {
            activity.setCompletedAt(Instant.now());
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(activity::setCustomer);
        }
        if (request.getLeadId() != null) {
            leadRepository.findById(request.getLeadId()).ifPresent(activity::setLead);
        }
        if (request.getDealId() != null) {
            dealRepository.findById(request.getDealId()).ifPresent(activity::setDeal);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(activity::setAssignedTo);
        }
        return mapper.toResponse(activityRepository.save(activity));
    }

    @Override
    public void delete(UUID id) {
        if (!activityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activity not found", "ACTIVITY_NOT_FOUND");
        }
        activityRepository.deleteById(id);
    }
}
