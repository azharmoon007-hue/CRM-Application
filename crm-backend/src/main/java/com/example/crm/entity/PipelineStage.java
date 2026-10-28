package com.example.crm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "pipeline_stages")
public class PipelineStage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id", nullable = false)
    private Pipeline pipeline;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private Integer probability;

    private String color;

    @Column(nullable = false)
    private Boolean active = true;
}
