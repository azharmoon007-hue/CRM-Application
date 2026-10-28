package com.example.crm.mapper;

import com.example.crm.dto.notification.NotificationResponse;
import com.example.crm.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationResponse toResponse(Notification notification);
}
