package com.example.crm.dto.note;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class NoteResponse {
    private UUID id;
    private String content;
    private UUID createdById;
    private String createdByName;
    private Instant createdAt;
}
