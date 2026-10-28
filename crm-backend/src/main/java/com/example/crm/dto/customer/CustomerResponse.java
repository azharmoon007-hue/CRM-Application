package com.example.crm.dto.customer;

import com.example.crm.entity.enums.CustomerSource;
import com.example.crm.entity.enums.CustomerStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class CustomerResponse {
    private UUID id;
    private String customerCode;
    private String companyName;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String alternatePhone;
    private String website;
    private String industry;
    private String companySize;
    private BigDecimal annualRevenue;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private CustomerStatus status;
    private CustomerSource source;
    private UUID assignedToId;
    private String assignedToName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
}
