package com.example.crm.service;

import com.example.crm.dto.email.*;

import java.util.List;
import java.util.UUID;

public interface EmailService {
    void send(SendEmailRequest request);
    List<EmailResponse> findAll();
    EmailTemplateResponse createTemplate(EmailTemplateRequest request);
    List<EmailTemplateResponse> findAllTemplates();
}
