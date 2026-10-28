package com.example.crm.dto.lead;

import com.example.crm.entity.enums.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadStatusRequest {
    @NotNull
    private LeadStatus status;
}
