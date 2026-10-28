package com.example.crm.service.impl;

import com.example.crm.dto.deal.*;
import com.example.crm.entity.*;
import com.example.crm.entity.enums.DealStatus;
import com.example.crm.exception.BusinessException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.DealMapper;
import com.example.crm.repository.*;
import com.example.crm.service.DealService;
import com.example.crm.specification.DealSpecification;
import com.example.crm.util.CodeGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class DealServiceImpl implements DealService {
    private final DealRepository dealRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final DealMapper dealMapper;
    private final DealSpecification specification;
    private final CodeGenerator codeGenerator;

    public DealServiceImpl(DealRepository dealRepository, CustomerRepository customerRepository,
                          UserRepository userRepository, PipelineRepository pipelineRepository,
                          PipelineStageRepository pipelineStageRepository, DealMapper dealMapper,
                          DealSpecification specification, CodeGenerator codeGenerator) {
        this.dealRepository = dealRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.pipelineRepository = pipelineRepository;
        this.pipelineStageRepository = pipelineStageRepository;
        this.dealMapper = dealMapper;
        this.specification = specification;
        this.codeGenerator = codeGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DealResponse> findAll(String search, DealStatus status, Pageable pageable) {
        return dealRepository.findAll(specification.search(search, status), pageable).map(dealMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DealResponse findById(UUID id) {
        return dealRepository.findById(id).map(dealMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND"));
    }

    @Override
    public DealResponse create(DealRequest request) {
        Deal deal = dealMapper.toEntity(request);
        deal.setDealCode(codeGenerator.generateDealCode());
        deal.setStatus(DealStatus.OPEN);
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(deal::setCustomer);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(deal::setAssignedTo);
        }
        if (request.getPipelineId() != null) {
            pipelineRepository.findById(request.getPipelineId()).ifPresent(deal::setPipeline);
        }
        if (request.getStageId() != null) {
            pipelineStageRepository.findById(request.getStageId()).ifPresent(deal::setStage);
            if (deal.getStage() != null && deal.getProbability() == null) {
                deal.setProbability(deal.getStage().getProbability());
            }
        }
        if (deal.getProbability() == null) {
            deal.setProbability(0);
        }
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Override
    public DealResponse update(UUID id, DealRequest request) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND"));
        if (deal.getStatus() == DealStatus.WON || deal.getStatus() == DealStatus.LOST) {
            throw new BusinessException("Cannot modify closed deal", "DEAL_CLOSED");
        }
        dealMapper.update(request, deal);
        if (request.getStageId() != null) {
            pipelineStageRepository.findById(request.getStageId()).ifPresent(deal::setStage);
            if (deal.getStage() != null) {
                deal.setProbability(deal.getStage().getProbability());
            }
        }
        if (request.getPipelineId() != null) {
            pipelineRepository.findById(request.getPipelineId()).ifPresent(deal::setPipeline);
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(deal::setCustomer);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(deal::setAssignedTo);
        }
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Override
    public void delete(UUID id) {
        if (!dealRepository.existsById(id)) {
            throw new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND");
        }
        dealRepository.deleteById(id);
    }

    @Override
    public DealResponse updateStage(UUID id, DealStageRequest request) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND"));
        if (deal.getStatus() == DealStatus.WON || deal.getStatus() == DealStatus.LOST) {
            throw new BusinessException("Cannot move closed deal", "DEAL_CLOSED");
        }
        PipelineStage stage = pipelineStageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Stage not found", "STAGE_NOT_FOUND"));
        deal.setStage(stage);
        deal.setPipeline(stage.getPipeline());
        deal.setProbability(stage.getProbability());
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Override
    public DealResponse markWon(UUID id, DealWonRequest request) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND"));
        if (deal.getStatus() == DealStatus.WON) {
            throw new BusinessException("Deal already won", "DEAL_ALREADY_WON");
        }
        deal.setStatus(DealStatus.WON);
        deal.setProbability(100);
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Override
    public DealResponse markLost(UUID id, DealLostRequest request) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found", "DEAL_NOT_FOUND"));
        deal.setStatus(DealStatus.LOST);
        deal.setProbability(0);
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getWeightedPipelineValue() {
        return dealRepository.findAll().stream()
                .filter(d -> d.getAmount() != null && d.getStatus() == DealStatus.OPEN)
                .map(d -> d.getAmount().multiply(BigDecimal.valueOf(d.getProbability() != null ? d.getProbability() : 0))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSalesMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long totalDeals = dealRepository.count();
        long wonDeals = dealRepository.countByStatus(DealStatus.WON);
        long lostDeals = dealRepository.countByStatus(DealStatus.LOST);
        metrics.put("totalDeals", totalDeals);
        metrics.put("wonDeals", wonDeals);
        metrics.put("lostDeals", lostDeals);
        metrics.put("winRate", totalDeals > 0 ? (wonDeals * 100.0 / totalDeals) : 0.0);
        return metrics;
    }
}
