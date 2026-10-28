package com.example.crm.dto.file;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class FileResponse {
    private UUID id;
    private String originalFileName;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Instant uploadedAt;
}
