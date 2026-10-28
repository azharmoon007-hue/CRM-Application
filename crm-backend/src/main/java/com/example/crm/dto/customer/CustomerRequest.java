package com.example.crm.dto.customer;

import com.example.crm.entity.enums.CustomerSource;
import com.example.crm.entity.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class CustomerRequest {
    @NotBlank
    private String companyName;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    @Email
    private String email;
    private String phone;
    private String alternatePhone;
    private String website;
    private String industry;
    private String companySize;
    @PositiveOrZero
    private BigDecimal annualRevenue;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    @NotNull
    private CustomerStatus status;
    @NotNull
    private CustomerSource source;
    private UUID assignedToId;
    private String notes;
}
