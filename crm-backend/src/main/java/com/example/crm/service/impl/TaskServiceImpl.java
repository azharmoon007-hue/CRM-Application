package com.example.crm.service.impl;

import com.example.crm.dto.task.TaskRequest;
import com.example.crm.dto.task.TaskResponse;
import com.example.crm.entity.Task;
import com.example.crm.entity.enums.TaskStatus;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.TaskMapper;
import com.example.crm.repository.*;
import com.example.crm.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final TaskMapper mapper;

    public TaskServiceImpl(TaskRepository taskRepository, CustomerRepository customerRepository,
                          LeadRepository leadRepository, DealRepository dealRepository,
                          UserRepository userRepository, TaskMapper mapper) {
        this.taskRepository = taskRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> findAll(Pageable pageable) {
        return taskRepository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse findById(UUID id) {
        return taskRepository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found", "TASK_NOT_FOUND"));
    }

    @Override
    public TaskResponse create(TaskRequest request) {
        Task task = mapper.toEntity(request);
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(task::setAssignedTo);
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(task::setCustomer);
        }
        if (request.getLeadId() != null) {
            leadRepository.findById(request.getLeadId()).ifPresent(task::setLead);
        }
        if (request.getDealId() != null) {
            dealRepository.findById(request.getDealId()).ifPresent(task::setDeal);
        }
        return mapper.toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse update(UUID id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found", "TASK_NOT_FOUND"));
        mapper.update(request, task);
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(task::setAssignedTo);
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(task::setCustomer);
        }
        if (request.getLeadId() != null) {
            leadRepository.findById(request.getLeadId()).ifPresent(task::setLead);
        }
        if (request.getDealId() != null) {
            dealRepository.findById(request.getDealId()).ifPresent(task::setDeal);
        }
        return mapper.toResponse(taskRepository.save(task));
    }

    @Override
    public void delete(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found", "TASK_NOT_FOUND");
        }
        taskRepository.deleteById(id);
    }
}
