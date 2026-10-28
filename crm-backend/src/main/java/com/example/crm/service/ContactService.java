package com.example.crm.service;

import com.example.crm.dto.contact.ContactRequest;
import com.example.crm.dto.contact.ContactResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ContactService {
    Page<ContactResponse> findAll(Pageable pageable);
    ContactResponse findById(UUID id);
    ContactResponse create(ContactRequest request);
    ContactResponse update(UUID id, ContactRequest request);
    void delete(UUID id);
}
