package com.example.crm.dto.dashboard;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Builder
public class ChartDataDto {
    private Map<String, Long> data;
    private Map<String, BigDecimal> revenueData;
}
