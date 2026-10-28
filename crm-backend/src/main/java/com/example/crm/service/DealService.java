package com.example.crm.service;

import com.example.crm.dto.deal.*;
import com.example.crm.entity.enums.DealStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public interface DealService {
    Page<DealResponse> findAll(String search, DealStatus status, Pageable pageable);
    DealResponse findById(UUID id);
    DealResponse create(DealRequest request);
    DealResponse update(UUID id, DealRequest request);
    void delete(UUID id);
    DealResponse updateStage(UUID id, DealStageRequest request);
    DealResponse markWon(UUID id, DealWonRequest request);
    DealResponse markLost(UUID id, DealLostRequest request);
    BigDecimal getWeightedPipelineValue();
    Map<String, Object> getSalesMetrics();
}
