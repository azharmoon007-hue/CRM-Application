package com.example.crm.service.impl;

import com.example.crm.dto.customer.CustomerRequest;
import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.entity.Customer;
import com.example.crm.entity.User;
import com.example.crm.entity.enums.CustomerStatus;
import com.example.crm.exception.DuplicateResourceException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.CustomerMapper;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.UserRepository;
import com.example.crm.service.CustomerService;
import com.example.crm.specification.CustomerSpecification;
import com.example.crm.util.CodeGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;
    private final CustomerSpecification specification;
    private final CodeGenerator codeGenerator;

    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository,
                              CustomerMapper customerMapper, CustomerSpecification specification,
                              CodeGenerator codeGenerator) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.customerMapper = customerMapper;
        this.specification = specification;
        this.codeGenerator = codeGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(String search, CustomerStatus status, String industry, Pageable pageable) {
        return customerRepository.findAll(specification.search(search, status, industry), pageable)
                .map(customerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse findById(UUID id) {
        return customerRepository.findById(id).map(customerMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found", "CUSTOMER_NOT_FOUND"));
    }

    @Override
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists", "EMAIL_EXISTS");
        }
        Customer customer = customerMapper.toEntity(request);
        customer.setCustomerCode(codeGenerator.generateCustomerCode());
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(customer::setAssignedTo);
        }
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Override
    public CustomerResponse update(UUID id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found", "CUSTOMER_NOT_FOUND"));
        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(customer.getEmail()) &&
                customerRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists", "EMAIL_EXISTS");
        }
        customerMapper.update(request, customer);
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(customer::setAssignedTo);
        } else if (request.getAssignedToId() == null) {
            customer.setAssignedTo(null);
        }
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Override
    public void delete(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found", "CUSTOMER_NOT_FOUND");
        }
        customerRepository.deleteById(id);
    }
}
