package com.example.crm.dto.email;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendEmailRequest {
    @NotBlank
    private String recipient;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
    private String cc;
    private String bcc;
}
