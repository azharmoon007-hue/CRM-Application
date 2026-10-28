package com.example.crm.util;

import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.dto.lead.LeadResponse;
import com.example.crm.dto.deal.DealResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class ExcelExportUtil {
    public byte[] exportCustomers(List<CustomerResponse> customers) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Customers");
            Row header = sheet.createRow(0);
            String[] columns = {"ID", "Name", "Email", "Company", "Status"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
            }
            int rowNum = 1;
            for (CustomerResponse c : customers) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getId() != null ? c.getId().toString() : "");
                row.createCell(1).setCellValue(c.getFirstName() + " " + c.getLastName());
                row.createCell(2).setCellValue(c.getEmail());
                row.createCell(3).setCellValue(c.getCompanyName());
                row.createCell(4).setCellValue(c.getStatus() != null ? c.getStatus().name() : "");
            }
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export", e);
        }
    }

    public byte[] exportLeads(List<LeadResponse> leads) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Leads");
            Row header = sheet.createRow(0);
            String[] columns = {"Name", "Email", "Company", "Status", "Value"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            int rowNum = 1;
            for (LeadResponse l : leads) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(l.getFirstName() + " " + l.getLastName());
                row.createCell(1).setCellValue(l.getEmail());
                row.createCell(2).setCellValue(l.getCompanyName());
                row.createCell(3).setCellValue(l.getStatus() != null ? l.getStatus().name() : "");
                row.createCell(4).setCellValue(l.getEstimatedValue() != null ? l.getEstimatedValue().doubleValue() : 0);
            }
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export", e);
        }
    }

    public byte[] exportDeals(List<DealResponse> deals) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Deals");
            Row header = sheet.createRow(0);
            String[] columns = {"Name", "Amount", "Stage", "Status"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            int rowNum = 1;
            for (DealResponse d : deals) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(d.getName());
                row.createCell(1).setCellValue(d.getAmount() != null ? d.getAmount().doubleValue() : 0);
                row.createCell(2).setCellValue(d.getStageName());
                row.createCell(3).setCellValue(d.getStatus() != null ? d.getStatus().name() : "");
            }
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export", e);
        }
    }
}
