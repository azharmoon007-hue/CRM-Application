package com.example.crm.service;

import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.dto.lead.LeadResponse;
import com.example.crm.dto.deal.DealResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    Page<CustomerResponse> getCustomerReport(Pageable pageable);
    Page<LeadResponse> getLeadReport(Pageable pageable);
    Page<DealResponse> getSalesReport(LocalDate from, LocalDate to, Pageable pageable);
    byte[] exportCustomersExcel();
    byte[] exportCustomersPdf();
    byte[] exportLeadsExcel();
    byte[] exportLeadsPdf();
    byte[] exportSalesExcel(LocalDate from, LocalDate to);
    byte[] exportSalesPdf(LocalDate from, LocalDate to);
}
