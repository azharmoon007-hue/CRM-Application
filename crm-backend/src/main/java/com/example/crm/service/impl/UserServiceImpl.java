package com.example.crm.service.impl;

import com.example.crm.dto.user.UserRequest;
import com.example.crm.dto.user.UserResponse;
import com.example.crm.entity.Role;
import com.example.crm.entity.User;
import com.example.crm.entity.enums.UserStatus;
import com.example.crm.exception.DuplicateResourceException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.UserMapper;
import com.example.crm.repository.RoleRepository;
import com.example.crm.repository.UserRepository;
import com.example.crm.service.UserService;
import com.example.crm.specification.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final UserSpecification specification;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                          UserMapper userMapper, UserSpecification specification,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.specification = specification;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(String search, Pageable pageable) {
        return userRepository.findAll(specification.search(search), pageable).map(userMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userRepository.findById(id).map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));
    }

    @Override
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists", "EMAIL_EXISTS");
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode("ChangeMe@123"));
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            user.setRoles(roles);
        }
        if (request.getManagerId() != null) {
            userRepository.findById(request.getManagerId()).ifPresent(user::setManager);
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse update(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));
        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail()) &&
                userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists", "EMAIL_EXISTS");
        }
        userMapper.update(request, user);
        if (request.getManagerId() != null) {
            userRepository.findById(request.getManagerId()).ifPresent(user::setManager);
        }
        if (request.getRoleIds() != null) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            user.setRoles(roles);
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found", "USER_NOT_FOUND");
        }
        userRepository.deleteById(id);
    }
}
