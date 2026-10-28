package com.example.crm.repository;

import com.example.crm.entity.EmailMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface EmailMessageRepository extends JpaRepository<EmailMessage, UUID>, JpaSpecificationExecutor<EmailMessage> {
}
