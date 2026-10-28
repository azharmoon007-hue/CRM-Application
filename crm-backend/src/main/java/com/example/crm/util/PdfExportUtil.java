package com.example.crm.util;

import com.example.crm.dto.customer.CustomerResponse;
import com.example.crm.dto.lead.LeadResponse;
import com.example.crm.dto.deal.DealResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfExportUtil {
    public byte[] exportCustomers(List<CustomerResponse> customers) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Customer Report", new Font(Font.HELVETICA, 16, Font.BOLD)));
            PdfPTable table = new PdfPTable(4);
            table.addCell("Name");
            table.addCell("Email");
            table.addCell("Company");
            table.addCell("Status");
            for (CustomerResponse c : customers) {
                table.addCell(c.getFirstName() + " " + c.getLastName());
                table.addCell(c.getEmail());
                table.addCell(c.getCompanyName());
                table.addCell(c.getStatus() != null ? c.getStatus().name() : "");
            }
            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    public byte[] exportLeads(List<LeadResponse> leads) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Lead Report", new Font(Font.HELVETICA, 16, Font.BOLD)));
            PdfPTable table = new PdfPTable(4);
            table.addCell("Name");
            table.addCell("Email");
            table.addCell("Company");
            table.addCell("Status");
            for (LeadResponse l : leads) {
                table.addCell(l.getFirstName() + " " + l.getLastName());
                table.addCell(l.getEmail());
                table.addCell(l.getCompanyName());
                table.addCell(l.getStatus() != null ? l.getStatus().name() : "");
            }
            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    public byte[] exportDeals(List<DealResponse> deals) {
        return exportSalesPdf(deals);
    }

    public byte[] exportSalesPdf(List<DealResponse> deals) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Deal Report", new Font(Font.HELVETICA, 16, Font.BOLD)));
            PdfPTable table = new PdfPTable(4);
            table.addCell("Name");
            table.addCell("Amount");
            table.addCell("Stage");
            table.addCell("Status");
            for (DealResponse d : deals) {
                table.addCell(d.getName());
                table.addCell(d.getAmount() != null ? d.getAmount().toString() : "0");
                table.addCell(d.getStageName());
                table.addCell(d.getStatus() != null ? d.getStatus().name() : "");
            }
            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
