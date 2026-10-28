package com.example.crm.service.impl;

import com.example.crm.dto.contact.ContactRequest;
import com.example.crm.dto.contact.ContactResponse;
import com.example.crm.entity.Contact;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.ContactMapper;
import com.example.crm.repository.ContactRepository;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.service.ContactService;
import com.example.crm.util.CodeGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final ContactMapper mapper;
    private final CodeGenerator codeGenerator;

    public ContactServiceImpl(ContactRepository contactRepository, CustomerRepository customerRepository,
                             ContactMapper mapper, CodeGenerator codeGenerator) {
        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
        this.mapper = mapper;
        this.codeGenerator = codeGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactResponse> findAll(Pageable pageable) {
        return contactRepository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponse findById(UUID id) {
        return contactRepository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found", "CONTACT_NOT_FOUND"));
    }

    @Override
    public ContactResponse create(ContactRequest request) {
        Contact contact = mapper.toEntity(request);
        contact.setContactCode(codeGenerator.generateContactCode());
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(contact::setCustomer);
        }
        return mapper.toResponse(contactRepository.save(contact));
    }

    @Override
    public ContactResponse update(UUID id, ContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found", "CONTACT_NOT_FOUND"));
        contact.setFirstName(request.getFirstName() != null ? request.getFirstName() : contact.getFirstName());
        contact.setLastName(request.getLastName() != null ? request.getLastName() : contact.getLastName());
        contact.setEmail(request.getEmail() != null ? request.getEmail() : contact.getEmail());
        contact.setPhone(request.getPhone() != null ? request.getPhone() : contact.getPhone());
        contact.setJobTitle(request.getJobTitle() != null ? request.getJobTitle() : contact.getJobTitle());
        if (request.getPrimaryContact() != null) {
            contact.setPrimaryContact(request.getPrimaryContact());
        }
        return mapper.toResponse(contactRepository.save(contact));
    }

    @Override
    public void delete(UUID id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found", "CONTACT_NOT_FOUND");
        }
        contactRepository.deleteById(id);
    }
}
