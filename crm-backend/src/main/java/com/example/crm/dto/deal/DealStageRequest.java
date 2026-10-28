package com.example.crm.dto.deal;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DealStageRequest {
    @NotNull
    private UUID stageId;
}
