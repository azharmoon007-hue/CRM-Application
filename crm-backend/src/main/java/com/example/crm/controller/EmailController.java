package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.email.*;
import com.example.crm.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    @PreAuthorize("hasAuthority('EMAIL_SEND')")
    public ResponseEntity<ApiResponse<Void>> send(@Valid @RequestBody SendEmailRequest request) {
        emailService.send(request);
        return ResponseEntity.ok(ApiResponse.ok("Email sent", null));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EMAIL_VIEW')")
    public ResponseEntity<ApiResponse<List<EmailResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok("Emails retrieved", emailService.findAll()));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EmailTemplateResponse>> createTemplate(@Valid @RequestBody EmailTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Template created", emailService.createTemplate(request)));
    }

    @GetMapping("/templates")
    @PreAuthorize("hasAuthority('EMAIL_VIEW')")
    public ResponseEntity<ApiResponse<List<EmailTemplateResponse>>> findAllTemplates() {
        return ResponseEntity.ok(ApiResponse.ok("Templates retrieved", emailService.findAllTemplates()));
    }
}
