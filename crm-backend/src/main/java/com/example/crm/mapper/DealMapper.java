package com.example.crm.mapper;

import com.example.crm.dto.deal.DealRequest;
import com.example.crm.dto.deal.DealResponse;
import com.example.crm.entity.Deal;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DealMapper {
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", expression = "java(deal.getAssignedTo() != null ? deal.getAssignedTo().getFullName() : null)")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(deal.getCustomer() != null ? deal.getCustomer().getCompanyName() : null)")
    @Mapping(target = "leadId", source = "lead.id")
    @Mapping(target = "pipelineId", source = "pipeline.id")
    @Mapping(target = "stageId", source = "stage.id")
    @Mapping(target = "stageName", source = "stage.name")
    DealResponse toResponse(Deal deal);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dealCode", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "pipeline", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Deal toEntity(DealRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(DealRequest request, @MappingTarget Deal lead);
}
