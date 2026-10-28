package com.example.crm.mapper;

import com.example.crm.dto.email.EmailResponse;
import com.example.crm.dto.email.EmailTemplateRequest;
import com.example.crm.dto.email.EmailTemplateResponse;
import com.example.crm.entity.EmailMessage;
import com.example.crm.entity.EmailTemplate;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EmailMapper {
    EmailResponse toResponse(EmailMessage message);
    EmailTemplateResponse toTemplateResponse(EmailTemplate template);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    EmailTemplate toTemplate(EmailTemplateRequest request);
}
