package com.example.crm.service.impl;

import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.dto.deal.DealResponse;
import com.example.crm.dto.lead.LeadResponse;
import com.example.crm.mapper.CustomerMapper;
import com.example.crm.mapper.DealMapper;
import com.example.crm.mapper.LeadMapper;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.DealRepository;
import com.example.crm.repository.LeadRepository;
import com.example.crm.service.ReportService;
import com.example.crm.util.ExcelExportUtil;
import com.example.crm.util.PdfExportUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final CustomerMapper customerMapper;
    private final LeadMapper leadMapper;
    private final DealMapper dealMapper;
    private final ExcelExportUtil excelExportUtil;
    private final PdfExportUtil pdfExportUtil;

    public ReportServiceImpl(CustomerRepository customerRepository, LeadRepository leadRepository,
                            DealRepository dealRepository, CustomerMapper customerMapper,
                            LeadMapper leadMapper, DealMapper dealMapper,
                            ExcelExportUtil excelExportUtil, PdfExportUtil pdfExportUtil) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.customerMapper = customerMapper;
        this.leadMapper = leadMapper;
        this.dealMapper = dealMapper;
        this.excelExportUtil = excelExportUtil;
        this.pdfExportUtil = pdfExportUtil;
    }

    @Override
    public Page<CustomerResponse> getCustomerReport(Pageable pageable) {
        return customerRepository.findAll(pageable).map(customerMapper::toResponse);
    }

    @Override
    public Page<LeadResponse> getLeadReport(Pageable pageable) {
        return leadRepository.findAll(pageable).map(leadMapper::toResponse);
    }

    @Override
    public Page<DealResponse> getSalesReport(LocalDate from, LocalDate to, Pageable pageable) {
        return dealRepository.findAll(pageable).map(dealMapper::toResponse);
    }

    @Override
    public byte[] exportCustomersExcel() {
        List<CustomerResponse> customers = customerRepository.findAll().stream().map(customerMapper::toResponse).collect(Collectors.toList());
        return excelExportUtil.exportCustomers(customers);
    }

    @Override
    public byte[] exportCustomersPdf() {
        List<CustomerResponse> customers = customerRepository.findAll().stream().map(customerMapper::toResponse).collect(Collectors.toList());
        return pdfExportUtil.exportCustomers(customers);
    }

    @Override
    public byte[] exportLeadsExcel() {
        List<LeadResponse> leads = leadRepository.findAll().stream().map(leadMapper::toResponse).collect(Collectors.toList());
        return excelExportUtil.exportLeads(leads);
    }

    @Override
    public byte[] exportLeadsPdf() {
        List<LeadResponse> leads = leadRepository.findAll().stream().map(leadMapper::toResponse).collect(Collectors.toList());
        return pdfExportUtil.exportLeads(leads);
    }

    @Override
    public byte[] exportSalesExcel(LocalDate from, LocalDate to) {
        List<DealResponse> deals = dealRepository.findAll().stream().map(dealMapper::toResponse).collect(Collectors.toList());
        return excelExportUtil.exportDeals(deals);
    }

    @Override
    public byte[] exportSalesPdf(LocalDate from, LocalDate to) {
        List<DealResponse> deals = dealRepository.findAll().stream().map(dealMapper::toResponse).collect(Collectors.toList());
        return pdfExportUtil.exportSalesPdf(deals);
    }
}
