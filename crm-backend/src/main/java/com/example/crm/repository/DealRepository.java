package com.example.crm.repository;

import com.example.crm.entity.Deal;
import com.example.crm.entity.enums.DealStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface DealRepository extends JpaRepository<Deal, UUID>, JpaSpecificationExecutor<Deal> {
    long countByStatus(DealStatus status);

    @Query("select coalesce(sum(d.amount), 0) from Deal d where d.status = :status")
    BigDecimal sumAmountByStatus(DealStatus status);

    @Query("select coalesce(sum(d.amount * d.probability / 100.0), 0) from Deal d where d.status = com.example.crm.entity.enums.DealStatus.OPEN")
    BigDecimal weightedPipelineValue();

    @Query("select d.stage.name, count(d), coalesce(sum(d.amount), 0) from Deal d group by d.stage.name")
    List<Object[]> countByStage();

    List<Deal> findByStatusAndExpectedCloseDateBefore(DealStatus status, java.time.LocalDate date);

    long countByCreatedAtBetween(Instant from, Instant to);
}
