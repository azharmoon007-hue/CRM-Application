package com.example.crm.dto.dashboard;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DashboardSummaryResponse {
    private long totalCustomers;
    private long totalLeads;
    private long newLeads;
    private long qualifiedLeads;
    private long convertedLeads;
    private long openDeals;
    private long wonDeals;
    private long lostDeals;
    private BigDecimal totalPipelineValue;
    private BigDecimal weightedPipelineValue;
    private BigDecimal revenue;
    private Double conversionRate;
    private Double winRate;
    private long tasksDueToday;
    private long overdueTasks;
    private long recentActivities;
}
