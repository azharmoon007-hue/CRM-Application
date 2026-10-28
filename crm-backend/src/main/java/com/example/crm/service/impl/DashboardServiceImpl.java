package com.example.crm.service.impl;

import com.example.crm.dto.dashboard.ChartDataDto;
import com.example.crm.dto.dashboard.DashboardSummaryResponse;
import com.example.crm.entity.enums.CustomerStatus;
import com.example.crm.entity.enums.DealStatus;
import com.example.crm.entity.enums.LeadStatus;
import com.example.crm.repository.*;
import com.example.crm.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public DashboardServiceImpl(CustomerRepository customerRepository, LeadRepository leadRepository,
                               DealRepository dealRepository, TaskRepository taskRepository,
                               ActivityRepository activityRepository) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public DashboardSummaryResponse getSummary() {
        return DashboardSummaryResponse.builder()
                .totalCustomers(customerRepository.count())
                .totalLeads(leadRepository.count())
                .newLeads(leadRepository.countByStatus(LeadStatus.NEW))
                .qualifiedLeads(leadRepository.countByStatus(LeadStatus.QUALIFIED))
                .convertedLeads(leadRepository.countByStatus(LeadStatus.CONVERTED))
                .openDeals(dealRepository.countByStatus(DealStatus.OPEN))
                .wonDeals(dealRepository.countByStatus(DealStatus.WON))
                .lostDeals(dealRepository.countByStatus(DealStatus.LOST))
                .totalPipelineValue(BigDecimal.ZERO)
                .weightedPipelineValue(BigDecimal.ZERO)
                .revenue(BigDecimal.ZERO)
                .conversionRate(0.0)
                .winRate(0.0)
                .tasksDueToday(0)
                .overdueTasks(0)
                .recentActivities(activityRepository.count())
                .build();
    }

    @Override
    public ChartDataDto getLeadsBySource(LocalDate from, LocalDate to) {
        Map<String, Long> data = new HashMap<>();
        return ChartDataDto.builder().data(data).build();
    }

    @Override
    public ChartDataDto getDealsByStage(LocalDate from, LocalDate to) {
        Map<String, Long> data = new HashMap<>();
        return ChartDataDto.builder().data(data).build();
    }

    @Override
    public ChartDataDto getRevenue(LocalDate from, LocalDate to) {
        return ChartDataDto.builder().revenueData(new HashMap<>()).build();
    }

    @Override
    public ChartDataDto getSalesPerformance(LocalDate from, LocalDate to) {
        return ChartDataDto.builder().data(new HashMap<>()).build();
    }

    @Override
    public ChartDataDto getMonthlySales(LocalDate from, LocalDate to) {
        return ChartDataDto.builder().data(new HashMap<>()).build();
    }
}
