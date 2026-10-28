package com.example.crm.service.impl;

import com.example.crm.dto.notification.NotificationResponse;
import com.example.crm.entity.Notification;
import com.example.crm.entity.User;
import com.example.crm.entity.enums.NotificationType;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.mapper.NotificationMapper;
import com.example.crm.repository.NotificationRepository;
import com.example.crm.repository.UserRepository;
import com.example.crm.service.NotificationService;
import com.example.crm.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper mapper;
    private final SecurityUtils securityUtils;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository,
                                  NotificationMapper mapper, SecurityUtils securityUtils) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.securityUtils = securityUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> findAllForCurrentUser(Pageable pageable) {
        UUID userId = securityUtils.getCurrentUserId()
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable).map(mapper::toResponse);
    }

    @Override
    public void createNotification(UUID userId, String title, String message, NotificationType type) {
        userRepository.findById(userId).ifPresent(user -> {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notificationRepository.save(notification);
        });
    }

    @Override
    public void markAsRead(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found", "NOTIFICATION_NOT_FOUND"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllRead() {
        securityUtils.getCurrentUserId().ifPresent(userId -> {
            notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                    .forEach(n -> {
                        n.setRead(true);
                        notificationRepository.save(n);
                    });
        });
    }
}
