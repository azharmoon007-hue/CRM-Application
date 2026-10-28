package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.contact.ContactRequest;
import com.example.crm.dto.contact.ContactResponse;
import com.example.crm.service.ContactService;
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
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('CONTACT_VIEW')")
    public ResponseEntity<ApiResponse<java.util.List<ContactResponse>>> findAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ContactResponse> page = contactService.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.page("Contacts retrieved", page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CONTACT_CREATE')")
    public ResponseEntity<ApiResponse<ContactResponse>> create(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Contact created", contactService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTACT_UPDATE')")
    public ResponseEntity<ApiResponse<ContactResponse>> update(@PathVariable UUID id, @Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Contact updated", contactService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTACT_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        contactService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Contact deleted", null));
    }
}
