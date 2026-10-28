package com.example.crm.mapper;

import com.example.crm.dto.lead.LeadRequest;
import com.example.crm.dto.lead.LeadResponse;
import com.example.crm.entity.Lead;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LeadMapper {
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", expression = "java(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : null)")
    LeadResponse toResponse(Lead lead);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "leadCode", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "convertedCustomer", ignore = true)
    @Mapping(target = "convertedDeal", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Lead toEntity(LeadRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(LeadRequest request, @MappingTarget Lead lead);
}
