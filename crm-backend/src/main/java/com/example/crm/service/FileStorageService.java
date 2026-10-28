package com.example.crm.service;

import com.example.crm.dto.file.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface FileStorageService {
    FileResponse upload(MultipartFile file, String entityType, UUID entityId);
    List<FileResponse> findByEntity(String entityType, UUID entityId);
    void delete(UUID id);
    org.springframework.core.io.Resource download(UUID id);
}
