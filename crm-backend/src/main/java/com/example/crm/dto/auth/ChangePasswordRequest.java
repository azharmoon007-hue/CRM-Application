package com.example.crm.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String currentPassword;
    @NotBlank
    @Size(min = 8, max = 72)
    private String newPassword;
}
