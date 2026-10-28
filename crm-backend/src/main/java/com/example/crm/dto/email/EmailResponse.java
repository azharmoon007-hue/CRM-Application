package com.example.crm.dto.email;

import com.example.crm.entity.enums.EmailStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class EmailResponse {
    private UUID id;
    private String sender;
    private String recipient;
    private String subject;
    private String body;
    private EmailStatus status;
    private Instant sentAt;
    private Instant createdAt;
}
