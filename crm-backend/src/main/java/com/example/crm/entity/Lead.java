package com.example.crm.entity;

import com.example.crm.entity.enums.CustomerSource;
import com.example.crm.entity.enums.LeadStatus;
import com.example.crm.entity.enums.Priority;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "leads")
public class Lead extends BaseEntity {
    @Column(nullable = false, unique = true, length = 40)
    private String leadCode;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    private String companyName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CustomerSource source;

    private String industry;
    private BigDecimal estimatedValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LeadStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Priority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    private LocalDate expectedCloseDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_customer_id")
    private Customer convertedCustomer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_deal_id")
    private Deal convertedDeal;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
