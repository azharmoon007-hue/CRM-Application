package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.common.AssignRequest;
import com.example.crm.dto.lead.*;
import com.example.crm.entity.enums.LeadStatus;
import com.example.crm.service.LeadService;
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
@RequestMapping("/api/leads")
public class LeadController {
    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_VIEW')")
    public ResponseEntity<ApiResponse<java.util.List<LeadResponse>>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<LeadResponse> page = leadService.findAll(search, status, pageable);
        return ResponseEntity.ok(ApiResponse.page("Leads retrieved", page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_VIEW')")
    public ResponseEntity<ApiResponse<LeadResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Lead retrieved", leadService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('LEAD_CREATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> create(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Lead created", leadService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_UPDATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> update(@PathVariable UUID id, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Lead updated", leadService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        leadService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Lead deleted", null));
    }

    @PostMapping("/{id}/qualify")
    @PreAuthorize("hasAuthority('LEAD_UPDATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> qualify(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Lead qualified", leadService.qualify(id)));
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAuthority('LEAD_UPDATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> convert(@PathVariable UUID id, @Valid @RequestBody ConvertLeadRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Lead converted", leadService.convert(id, request)));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('LEAD_UPDATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> assign(@PathVariable UUID id, @Valid @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Lead assigned", leadService.assign(id, request)));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasAuthority('LEAD_UPDATE')")
    public ResponseEntity<ApiResponse<LeadResponse>> updateStatus(@PathVariable UUID id, @Valid @RequestBody LeadStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", leadService.updateStatus(id, request)));
    }
}
