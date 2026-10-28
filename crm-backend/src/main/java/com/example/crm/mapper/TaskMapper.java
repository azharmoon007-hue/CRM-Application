package com.example.crm.mapper;

import com.example.crm.dto.task.TaskRequest;
import com.example.crm.dto.task.TaskResponse;
import com.example.crm.entity.Task;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", expression = "java(task.getAssignedTo() != null ? task.getAssignedTo().getFullName() : null)")
    TaskResponse toResponse(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "deal", ignore = true)
    @Mapping(target = "reminderSent", ignore = true)
    @Mapping(target = "reminderAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task toEntity(TaskRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(TaskRequest request, @MappingTarget Task task);
}
