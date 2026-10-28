package com.example.crm.dto.contact;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class ContactResponse {
    private UUID id;
    private String contactCode;
    private UUID customerId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String jobTitle;
    private Boolean primaryContact;
    private Instant createdAt;
}
