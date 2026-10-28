package com.example.crm.dto.lead;

import com.example.crm.entity.enums.CustomerSource;
import com.example.crm.entity.enums.LeadStatus;
import com.example.crm.entity.enums.Priority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class LeadRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    private String companyName;
    @NotBlank
    @Email
    private String email;
    private String phone;
    @NotNull
    private CustomerSource source;
    private String industry;
    @PositiveOrZero
    private BigDecimal estimatedValue;
    private LeadStatus status;
    private Priority priority;
    private UUID assignedToId;
    private LocalDate expectedCloseDate;
    private String description;
}
