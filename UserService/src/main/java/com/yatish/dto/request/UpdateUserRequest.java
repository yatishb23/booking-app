package com.yatish.dto.request;

import lombok.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    @Size(max = 255, message = "Full name must be at most 255 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 255, message = "Locale must be at most 255 characters")
    private String locale;

    // Optional: Update role (ADMIN / USER / ORGANIZER)
    private String role;

    // Optional: Update password
    @Size(min = 3, max = 255, message = "Password must be between 3 and 255 characters")
    private String password;
}