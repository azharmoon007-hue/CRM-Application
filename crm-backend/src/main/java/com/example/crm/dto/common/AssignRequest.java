package com.example.crm.dto.common;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AssignRequest {
    @NotNull
    private UUID assignedToId;
}
