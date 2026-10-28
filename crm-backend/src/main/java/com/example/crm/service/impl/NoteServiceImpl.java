package com.example.crm.service.impl;

import com.example.crm.dto.note.NoteRequest;
import com.example.crm.dto.note.NoteResponse;
import com.example.crm.entity.Note;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.NoteMapper;
import com.example.crm.repository.*;
import com.example.crm.service.NoteService;
import com.example.crm.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final NoteMapper mapper;
    private final SecurityUtils securityUtils;

    public NoteServiceImpl(NoteRepository noteRepository, CustomerRepository customerRepository,
                          LeadRepository leadRepository, DealRepository dealRepository,
                          ContactRepository contactRepository, UserRepository userRepository,
                          NoteMapper mapper, SecurityUtils securityUtils) {
        this.noteRepository = noteRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.securityUtils = securityUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoteResponse> findAll(Pageable pageable) {
        return noteRepository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public NoteResponse create(NoteRequest request) {
        Note note = mapper.toEntity(request);
        securityUtils.getCurrentUserId().flatMap(userRepository::findById).ifPresent(note::setCreatedBy);
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(note::setCustomer);
        }
        if (request.getLeadId() != null) {
            leadRepository.findById(request.getLeadId()).ifPresent(note::setLead);
        }
        if (request.getDealId() != null) {
            dealRepository.findById(request.getDealId()).ifPresent(note::setDeal);
        }
        if (request.getContactId() != null) {
            contactRepository.findById(request.getContactId()).ifPresent(note::setContact);
        }
        return mapper.toResponse(noteRepository.save(note));
    }

    @Override
    public NoteResponse update(UUID id, NoteRequest request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found", "NOTE_NOT_FOUND"));
        note.setContent(request.getContent() != null ? request.getContent() : note.getContent());
        return mapper.toResponse(noteRepository.save(note));
    }

    @Override
    public void delete(UUID id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found", "NOTE_NOT_FOUND");
        }
        noteRepository.deleteById(id);
    }
}
