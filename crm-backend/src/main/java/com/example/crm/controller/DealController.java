package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.deal.*;
import com.example.crm.entity.enums.DealStatus;
import com.example.crm.service.DealService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deals")
public class DealController {
    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('DEAL_VIEW')")
    public ResponseEntity<ApiResponse<java.util.List<DealResponse>>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DealStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<DealResponse> page = dealService.findAll(search, status, pageable);
        return ResponseEntity.ok(ApiResponse.page("Deals retrieved", page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DEAL_VIEW')")
    public ResponseEntity<ApiResponse<DealResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Deal retrieved", dealService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('DEAL_CREATE')")
    public ResponseEntity<ApiResponse<DealResponse>> create(@Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Deal created", dealService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DEAL_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> update(@PathVariable UUID id, @Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Deal updated", dealService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DEAL_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        dealService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deal deleted", null));
    }

    @PostMapping("/{id}/stage")
    @PreAuthorize("hasAuthority('DEAL_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> updateStage(@PathVariable UUID id, @Valid @RequestBody DealStageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Stage updated", dealService.updateStage(id, request)));
    }

    @PostMapping("/{id}/won")
    @PreAuthorize("hasAuthority('DEAL_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> markWon(@PathVariable UUID id, @RequestBody DealWonRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Deal won", dealService.markWon(id, request)));
    }

    @PostMapping("/{id}/lost")
    @PreAuthorize("hasAuthority('DEAL_UPDATE')")
    public ResponseEntity<ApiResponse<DealResponse>> markLost(@PathVariable UUID id, @RequestBody DealLostRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Deal lost", dealService.markLost(id, request)));
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAuthority('DEAL_VIEW')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> metrics() {
        return ResponseEntity.ok(ApiResponse.ok("Metrics retrieved", dealService.getSalesMetrics()));
    }
}
