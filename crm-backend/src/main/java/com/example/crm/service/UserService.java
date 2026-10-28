package com.example.crm.service;

import com.example.crm.dto.user.UserRequest;
import com.example.crm.dto.user.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    Page<UserResponse> findAll(String search, Pageable pageable);
    UserResponse findById(UUID id);
    UserResponse create(UserRequest request);
    UserResponse update(UUID id, UserRequest request);
    void delete(UUID id);
}
