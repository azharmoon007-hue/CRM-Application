package com.example.crm.dto.email;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class EmailTemplateResponse {
    private UUID id;
    private String name;
    private String subject;
    private String body;
    private boolean active;
    private Instant createdAt;
}
