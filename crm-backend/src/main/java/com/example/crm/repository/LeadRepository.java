package com.example.crm.repository;

import com.example.crm.entity.Lead;
import com.example.crm.entity.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {
    long countByStatus(LeadStatus status);

    long countByCreatedAtBetween(Instant from, Instant to);

    @Query("select l.source as source, count(l) as total from Lead l group by l.source")
    List<Object[]> countBySource();
}
