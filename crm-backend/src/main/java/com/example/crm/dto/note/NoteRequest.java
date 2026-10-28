package com.example.crm.dto.note;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class NoteRequest {
    @NotBlank
    private String content;
    private UUID customerId;
    private UUID leadId;
    private UUID dealId;
    private UUID contactId;
}
