package com.example.crm.storage;

import com.example.crm.config.CrmProperties;
import com.example.crm.dto.file.FileResponse;
import com.example.crm.entity.Attachment;
import com.example.crm.entity.enums.AttachmentEntityType;
import com.example.crm.exception.BusinessException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.repository.AttachmentRepository;
import com.example.crm.service.FileStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocalFileStorageService implements FileStorageService {
    private final AttachmentRepository attachmentRepository;
    private final CrmProperties properties;

    public LocalFileStorageService(AttachmentRepository attachmentRepository, CrmProperties properties) {
        this.attachmentRepository = attachmentRepository;
        this.properties = properties;
    }

    @Override
    public FileResponse upload(MultipartFile file, String entityType, UUID entityId) {
        try {
            Path dir = Paths.get(properties.getStorage().getLocalPath());
            Files.createDirectories(dir);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = new Attachment();
            attachment.setFileName(filename);
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setStoragePath(target.toString());
            attachment.setEntityId(entityId);
            attachment.setUploadedAt(Instant.now());
            attachmentRepository.save(attachment);

            return FileResponse.builder()
                    .id(attachment.getId())
                    .originalFileName(attachment.getOriginalFileName())
                    .fileName(attachment.getFileName())
                    .fileType(attachment.getFileType())
                    .fileSize(attachment.getFileSize())
                    .uploadedAt(attachment.getUploadedAt())
                    .build();
        } catch (IOException e) {
            throw new BusinessException("Failed to upload file", "FILE_UPLOAD_ERROR");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileResponse> findByEntity(String entityType, UUID entityId) {
        return attachmentRepository.findByEntityTypeAndEntityId(entityType.toUpperCase(), entityId).stream()
                .map(a -> FileResponse.builder()
                        .id(a.getId())
                        .originalFileName(a.getOriginalFileName())
                        .fileName(a.getFileName())
                        .fileType(a.getFileType())
                        .fileSize(a.getFileSize())
                        .uploadedAt(a.getUploadedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        attachmentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource download(UUID id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found", "FILE_NOT_FOUND"));
        return new FileSystemResource(attachment.getStoragePath());
    }
}
