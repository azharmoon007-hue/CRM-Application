package com.example.crm.service;

import com.example.crm.dto.dashboard.DashboardSummaryResponse;
import com.example.crm.dto.dashboard.ChartDataDto;

import java.time.LocalDate;

public interface DashboardService {
    DashboardSummaryResponse getSummary();
    ChartDataDto getLeadsBySource(LocalDate from, LocalDate to);
    ChartDataDto getDealsByStage(LocalDate from, LocalDate to);
    ChartDataDto getRevenue(LocalDate from, LocalDate to);
    ChartDataDto getSalesPerformance(LocalDate from, LocalDate to);
    ChartDataDto getMonthlySales(LocalDate from, LocalDate to);
}
