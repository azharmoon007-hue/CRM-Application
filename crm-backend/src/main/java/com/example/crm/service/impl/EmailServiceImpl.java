package com.example.crm.service.impl;

import com.example.crm.dto.email.*;
import com.example.crm.entity.EmailMessage;
import com.example.crm.entity.EmailTemplate;
import com.example.crm.entity.enums.EmailStatus;
import com.example.crm.mapper.EmailMapper;
import com.example.crm.repository.EmailMessageRepository;
import com.example.crm.repository.EmailTemplateRepository;
import com.example.crm.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final EmailMessageRepository emailMessageRepository;
    private final EmailTemplateRepository emailTemplateRepository;
    private final EmailMapper mapper;

    public EmailServiceImpl(JavaMailSender mailSender, EmailMessageRepository emailMessageRepository,
                           EmailTemplateRepository emailTemplateRepository, EmailMapper mapper) {
        this.mailSender = mailSender;
        this.emailMessageRepository = emailMessageRepository;
        this.emailTemplateRepository = emailTemplateRepository;
        this.mapper = mapper;
    }

    @Override
    public void send(SendEmailRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getRecipient());
            if (request.getCc() != null) message.setCc(request.getCc());
            if (request.getBcc() != null) message.setBcc(request.getBcc());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());
            mailSender.send(message);

            EmailMessage emailMessage = new EmailMessage();
            emailMessage.setSender("noreply@crm.local");
            emailMessage.setRecipient(request.getRecipient());
            emailMessage.setCc(request.getCc());
            emailMessage.setBcc(request.getBcc());
            emailMessage.setSubject(request.getSubject());
            emailMessage.setBody(request.getBody());
            emailMessage.setStatus(EmailStatus.SENT);
            emailMessage.setSentAt(Instant.now());
            emailMessageRepository.save(emailMessage);
        } catch (Exception e) {
            EmailMessage emailMessage = new EmailMessage();
            emailMessage.setSender("noreply@crm.local");
            emailMessage.setRecipient(request.getRecipient());
            emailMessage.setSubject(request.getSubject());
            emailMessage.setBody(request.getBody());
            emailMessage.setStatus(EmailStatus.FAILED);
            emailMessageRepository.save(emailMessage);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmailResponse> findAll() {
        return emailMessageRepository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public EmailTemplateResponse createTemplate(EmailTemplateRequest request) {
        EmailTemplate template = mapper.toTemplate(request);
        if (Boolean.TRUE.equals(template.getActive())) {
            // default
        }
        if (template.getActive() == null) template.setActive(true);
        return mapper.toTemplateResponse(emailTemplateRepository.save(template));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmailTemplateResponse> findAllTemplates() {
        return emailTemplateRepository.findAll().stream().map(mapper::toTemplateResponse).collect(Collectors.toList());
    }
}
