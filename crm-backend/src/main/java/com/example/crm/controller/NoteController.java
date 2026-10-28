package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.note.NoteRequest;
import com.example.crm.dto.note.NoteResponse;
import com.example.crm.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('NOTE_VIEW')")
    public ResponseEntity<ApiResponse<java.util.List<NoteResponse>>> findAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> page = noteService.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.page("Notes retrieved", page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('NOTE_CREATE')")
    public ResponseEntity<ApiResponse<NoteResponse>> create(@Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Note created", noteService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('NOTE_UPDATE')")
    public ResponseEntity<ApiResponse<NoteResponse>> update(@PathVariable UUID id, @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Note updated", noteService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('NOTE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        noteService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted", null));
    }
}
