package com.example.crm.service;

import com.example.crm.dto.task.TaskRequest;
import com.example.crm.dto.task.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TaskService {
    Page<TaskResponse> findAll(Pageable pageable);
    TaskResponse findById(UUID id);
    TaskResponse create(TaskRequest request);
    TaskResponse update(UUID id, TaskRequest request);
    void delete(UUID id);
}
