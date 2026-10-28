package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.file.FileResponse;
import com.example.crm.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('FILE_UPLOAD')")
    public ResponseEntity<ApiResponse<FileResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") UUID entityId) {
        return ResponseEntity.ok(ApiResponse.ok("File uploaded", fileStorageService.upload(file, entityType, entityId)));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasAuthority('FILE_UPLOAD')")
    public ResponseEntity<ApiResponse<List<FileResponse>>> getByEntity(@PathVariable String entityType, @PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.ok("Files retrieved", fileStorageService.findByEntity(entityType, entityId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('FILE_UPLOAD')")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        Resource resource = fileStorageService.download(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('FILE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        fileStorageService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("File deleted", null));
    }
}
