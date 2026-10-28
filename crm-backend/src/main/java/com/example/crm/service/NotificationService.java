package com.example.crm.service;

import com.example.crm.dto.notification.NotificationResponse;
import com.example.crm.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationService {
    Page<NotificationResponse> findAllForCurrentUser(Pageable pageable);
    void createNotification(UUID userId, String title, String message, NotificationType type);
    void markAsRead(UUID id);
    void markAllRead();
}
