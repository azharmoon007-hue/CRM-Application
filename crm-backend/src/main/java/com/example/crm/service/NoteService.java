package com.example.crm.service;

import com.example.crm.dto.note.NoteRequest;
import com.example.crm.dto.note.NoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NoteService {
    Page<NoteResponse> findAll(Pageable pageable);
    NoteResponse create(NoteRequest request);
    NoteResponse update(UUID id, NoteRequest request);
    void delete(UUID id);
}
