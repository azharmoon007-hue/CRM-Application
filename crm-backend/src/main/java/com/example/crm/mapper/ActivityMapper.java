package com.example.crm.mapper;

import com.example.crm.dto.activity.ActivityRequest;
import com.example.crm.dto.activity.ActivityResponse;
import com.example.crm.entity.Activity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", expression = "java(activity.getAssignedTo() != null ? activity.getAssignedTo().getFullName() : null)")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "leadId", source = "lead.id")
    @Mapping(target = "dealId", source = "deal.id")
    ActivityResponse toResponse(Activity activity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "deal", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Activity toEntity(ActivityRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(ActivityRequest request, @MappingTarget Activity activity);
}
