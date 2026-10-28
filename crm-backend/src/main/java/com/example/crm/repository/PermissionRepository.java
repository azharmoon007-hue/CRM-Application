package com.example.crm.repository;

import com.example.crm.entity.Permission;
import com.example.crm.entity.enums.PermissionName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    Optional<Permission> findByName(PermissionName name);
    boolean existsByName(PermissionName name);
}
