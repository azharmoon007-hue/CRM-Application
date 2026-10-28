package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.pipeline.*;
import com.example.crm.service.PipelineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pipelines")
public class PipelineController {
    private final PipelineService pipelineService;

    public PipelineController(PipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PIPELINE_VIEW')")
    public ResponseEntity<ApiResponse<List<PipelineResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok("Pipelines retrieved", pipelineService.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PIPELINE_CREATE')")
    public ResponseEntity<ApiResponse<PipelineResponse>> create(@Valid @RequestBody PipelineRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Pipeline created", pipelineService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PIPELINE_UPDATE')")
    public ResponseEntity<ApiResponse<PipelineResponse>> update(@PathVariable UUID id, @Valid @RequestBody PipelineRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Pipeline updated", pipelineService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PIPELINE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        pipelineService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Pipeline deleted", null));
    }

    @GetMapping("/{id}/stages")
    @PreAuthorize("hasAuthority('PIPELINE_VIEW')")
    public ResponseEntity<ApiResponse<List<PipelineStageResponse>>> getStages(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Stages retrieved", pipelineService.getStages(id)));
    }

    @PostMapping("/{id}/stages")
    @PreAuthorize("hasAuthority('PIPELINE_CREATE')")
    public ResponseEntity<ApiResponse<PipelineStageResponse>> addStage(@PathVariable UUID id, @Valid @RequestBody PipelineStageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Stage added", pipelineService.addStage(id, request)));
    }

    @PutMapping("/stages/{id}")
    @PreAuthorize("hasAuthority('PIPELINE_UPDATE')")
    public ResponseEntity<ApiResponse<PipelineStageResponse>> updateStage(@PathVariable UUID id, @Valid @RequestBody PipelineStageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Stage updated", pipelineService.updateStage(id, request)));
    }

    @DeleteMapping("/stages/{id}")
    @PreAuthorize("hasAuthority('PIPELINE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteStage(@PathVariable UUID id) {
        pipelineService.deleteStage(id);
        return ResponseEntity.ok(ApiResponse.ok("Stage deleted", null));
    }
}
