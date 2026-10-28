package com.example.crm.repository;

import com.example.crm.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID>, JpaSpecificationExecutor<Activity> {
    List<Activity> findTop10ByOrderByCreatedAtDesc();

    List<Activity> findByTypeAndStatusAndDueDateBetween(
            com.example.crm.entity.enums.ActivityType type,
            com.example.crm.entity.enums.ActivityStatus status,
            Instant from,
            Instant to);
}
