package com.example.crm.dto.user;

import com.example.crm.entity.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Getter
@Builder
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private UserStatus status;
    private String department;
    private String designation;
    private UUID managerId;
    private boolean emailVerified;
    private Instant lastLoginAt;
    private Instant createdAt;
    private Set<String> roles;
}
