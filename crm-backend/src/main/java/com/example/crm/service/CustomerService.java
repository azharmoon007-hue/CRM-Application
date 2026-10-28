package com.example.crm.service;

import com.example.crm.dto.customer.CustomerRequest;
import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.entity.enums.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CustomerService {
    Page<CustomerResponse> findAll(String search, CustomerStatus status, String industry, Pageable pageable);
    CustomerResponse findById(UUID id);
    CustomerResponse create(CustomerRequest request);
    CustomerResponse update(UUID id, CustomerRequest request);
    void delete(UUID id);
}
