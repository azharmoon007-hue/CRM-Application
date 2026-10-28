package com.example.crm.mapper;

import com.example.crm.dto.contact.ContactRequest;
import com.example.crm.dto.contact.ContactResponse;
import com.example.crm.entity.Contact;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ContactMapper {
    @Mapping(target = "customerId", source = "customer.id")
    ContactResponse toResponse(Contact contact);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contactCode", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Contact toEntity(ContactRequest request);
}
