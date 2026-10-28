package com.example.crm.entity;

import com.example.crm.entity.enums.EmailStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "emails")
public class EmailMessage extends BaseEntity {
    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String recipient;

    private String cc;
    private String bcc;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private EmailTemplate template;

    private Instant sentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EmailStatus status;
}
