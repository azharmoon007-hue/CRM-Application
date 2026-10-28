package com.example.crm.util;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class CodeGenerator {
    private final AtomicLong customerSequence = new AtomicLong(1);
    private final AtomicLong leadSequence = new AtomicLong(1);
    private final AtomicLong dealSequence = new AtomicLong(1);
    private final AtomicLong contactSequence = new AtomicLong(1);

    public String generateCustomerCode() {
        return String.format("CUS-%08d", customerSequence.incrementAndGet());
    }

    public String generateLeadCode() {
        return String.format("LEAD-%08d", leadSequence.incrementAndGet());
    }

    public String generateDealCode() {
        return String.format("DEAL-%08d", dealSequence.incrementAndGet());
    }

    public String generateContactCode() {
        return String.format("CON-%08d", contactSequence.incrementAndGet());
    }
}
