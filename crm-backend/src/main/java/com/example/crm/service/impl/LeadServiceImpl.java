package com.example.crm.service.impl;

import com.example.crm.dto.common.AssignRequest;
import com.example.crm.dto.lead.*;
import com.example.crm.entity.*;
import com.example.crm.entity.enums.*;
import com.example.crm.exception.BusinessException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.LeadMapper;
import com.example.crm.repository.*;
import com.example.crm.service.LeadService;
import com.example.crm.specification.LeadSpecification;
import com.example.crm.util.CodeGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class LeadServiceImpl implements LeadService {
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final ContactRepository contactRepository;
    private final LeadMapper leadMapper;
    private final LeadSpecification specification;
    private final CodeGenerator codeGenerator;

    public LeadServiceImpl(LeadRepository leadRepository, UserRepository userRepository,
                          CustomerRepository customerRepository, DealRepository dealRepository,
                          PipelineRepository pipelineRepository, PipelineStageRepository pipelineStageRepository,
                          ContactRepository contactRepository, LeadMapper leadMapper,
                          LeadSpecification specification, CodeGenerator codeGenerator) {
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.pipelineRepository = pipelineRepository;
        this.pipelineStageRepository = pipelineStageRepository;
        this.contactRepository = contactRepository;
        this.leadMapper = leadMapper;
        this.specification = specification;
        this.codeGenerator = codeGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeadResponse> findAll(String search, LeadStatus status, Pageable pageable) {
        return leadRepository.findAll(specification.search(search, status), pageable).map(leadMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse findById(UUID id) {
        return leadRepository.findById(id).map(leadMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
    }

    @Override
    public LeadResponse create(LeadRequest request) {
        Lead lead = leadMapper.toEntity(request);
        lead.setLeadCode(codeGenerator.generateLeadCode());
        lead.setStatus(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW);
        lead.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(lead::setAssignedTo);
        }
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Override
    public LeadResponse update(UUID id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
        leadMapper.update(request, lead);
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(lead::setAssignedTo);
        }
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Override
    public void delete(UUID id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND");
        }
        leadRepository.deleteById(id);
    }

    @Override
    public LeadResponse qualify(UUID id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
        lead.setStatus(LeadStatus.QUALIFIED);
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Override
    public LeadResponse convert(UUID id, ConvertLeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new BusinessException("Lead already converted", "LEAD_ALREADY_CONVERTED");
        }
        Customer customer = new Customer();
        customer.setCustomerCode(codeGenerator.generateCustomerCode());
        customer.setCompanyName(lead.getCompanyName() != null ? lead.getCompanyName() : lead.getFullName());
        customer.setFirstName(lead.getFirstName());
        customer.setLastName(lead.getLastName());
        customer.setEmail(lead.getEmail());
        customer.setPhone(lead.getPhone());
        customer.setStatus(CustomerStatus.ACTIVE);
        customer.setSource(lead.getSource());
        customer = customerRepository.save(customer);

        Contact contact = new Contact();
        contact.setContactCode(codeGenerator.generateContactCode());
        contact.setCustomer(customer);
        contact.setFirstName(lead.getFirstName());
        contact.setLastName(lead.getLastName());
        contact.setEmail(lead.getEmail());
        contact.setPhone(lead.getPhone());
        contact.setPrimaryContact(true);
        contactRepository.save(contact);

        Pipeline pipeline = pipelineRepository.findById(request.getPipelineId())
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found", "PIPELINE_NOT_FOUND"));
        PipelineStage stage = pipelineStageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Stage not found", "STAGE_NOT_FOUND"));

        Deal deal = new Deal();
        deal.setDealCode(codeGenerator.generateDealCode());
        deal.setName(request.getDealName() != null ? request.getDealName() : (customer.getCompanyName() + " Deal"));
        deal.setCustomer(customer);
        deal.setLead(lead);
        deal.setAssignedTo(lead.getAssignedTo());
        deal.setPipeline(pipeline);
        deal.setStage(stage);
        deal.setAmount(request.getDealAmount() != null ? request.getDealAmount() : java.math.BigDecimal.ZERO);
        deal.setCurrency("USD");
        deal.setProbability(stage.getProbability());
        deal.setStatus(DealStatus.OPEN);
        deal = dealRepository.save(deal);

        lead.setStatus(LeadStatus.CONVERTED);
        lead.setConvertedCustomer(customer);
        lead.setConvertedDeal(deal);
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Override
    public LeadResponse assign(UUID id, AssignRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
        userRepository.findById(request.getAssignedToId()).ifPresent(lead::setAssignedTo);
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Override
    public LeadResponse updateStatus(UUID id, LeadStatusUpdateRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found", "LEAD_NOT_FOUND"));
        lead.setStatus(request.getStatus());
        return leadMapper.toResponse(leadRepository.save(lead));
    }
}
