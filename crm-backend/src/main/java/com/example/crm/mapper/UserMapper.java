package com.example.crm.mapper;

import com.example.crm.dto.user.UserRequest;
import com.example.crm.dto.user.UserResponse;
import com.example.crm.entity.User;
import org.mapstruct.*;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    @Mapping(target = "managerId", source = "manager.id")
    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(r -> r.getName().name()).collect(java.util.stream.Collectors.toSet()))")
    UserResponse toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "manager", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    User toEntity(UserRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(UserRequest request, @MappingTarget User user);
}
