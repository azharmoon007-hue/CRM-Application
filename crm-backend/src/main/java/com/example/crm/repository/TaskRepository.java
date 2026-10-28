package com.example.crm.repository;

import com.example.crm.entity.Task;
import com.example.crm.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    List<Task> findByStatusInAndDueDateBefore(Collection<TaskStatus> statuses, Instant before);

    List<Task> findByReminderSentFalseAndReminderAtBefore(Instant before);

    long countByStatusInAndDueDateBetween(Collection<TaskStatus> statuses, Instant from, Instant to);

    long countByStatus(TaskStatus status);
}
