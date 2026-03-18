package com.yatish.dto.response;

import com.yatish.model.User;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private boolean success;
    private String message;
    private int code;

    private UserResponse user; 
}