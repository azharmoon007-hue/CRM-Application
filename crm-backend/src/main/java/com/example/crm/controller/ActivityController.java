package com.example.crm.controller;

import com.example.crm.dto.activity.ActivityRequest;
import com.example.crm.dto.activity.ActivityResponse;
import com.example.crm.dto.common.ApiResponse;
import com.example.crm.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ACTIVITY_VIEW')")
    public ResponseEntity<ApiResponse<java.util.List<ActivityResponse>>> findAll(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ActivityResponse> page = activityService.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.page("Activities retrieved", page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ACTIVITY_CREATE')")
    public ResponseEntity<ApiResponse<ActivityResponse>> create(@Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Activity created", activityService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ACTIVITY_UPDATE')")
    public ResponseEntity<ApiResponse<ActivityResponse>> update(@PathVariable UUID id, @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Activity updated", activityService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ACTIVITY_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        activityService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Activity deleted", null));
    }
}
