package com.example.crm.dto.lead;

import com.example.crm.entity.enums.CustomerSource;
import com.example.crm.entity.enums.LeadStatus;
import com.example.crm.entity.enums.Priority;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class LeadResponse {
    private UUID id;
    private String leadCode;
    private String firstName;
    private String lastName;
    private String companyName;
    private String email;
    private String phone;
    private CustomerSource source;
    private String industry;
    private BigDecimal estimatedValue;
    private LeadStatus status;
    private Priority priority;
    private UUID assignedToId;
    private String assignedToName;
    private LocalDate expectedCloseDate;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
