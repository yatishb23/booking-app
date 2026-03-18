package com.yatish.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yatish.dto.request.GoogleUser;
import com.yatish.dto.request.LoginRequest;
import com.yatish.dto.request.SignupRequest;
import com.yatish.dto.response.AuthResponse;
import com.yatish.model.User;
import com.yatish.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleUser dto) {
        AuthResponse user = authService.handleGoogleLogin(dto);

        return ResponseEntity.ok(user);
    }
}
