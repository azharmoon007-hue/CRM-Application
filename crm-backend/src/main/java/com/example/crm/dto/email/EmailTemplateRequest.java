package com.example.crm.dto.email;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailTemplateRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
    private Boolean active;
}
