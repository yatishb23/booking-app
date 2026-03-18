package com.yatish.service;

import com.yatish.dto.request.GoogleUser;
import com.yatish.dto.request.LoginRequest;
import com.yatish.dto.request.SignupRequest;
import com.yatish.dto.response.AuthResponse;
import com.yatish.dto.response.UserResponse;
import com.yatish.model.User;
import com.yatish.repository.UserRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail())!=null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered")
                    .code(400)
                    .build();
        }

        User user = new User();
        user.setFullName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setTenantId(generateTenantId());
        user.setReferralCode(generateReferralCode());
        user.setIsActive(true);

        userRepository.save(user);

        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .success(true)
                .message("Signup successful")
                .code(201)
                .user(userResponse)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null || 
            !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {

            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .code(401)
                    .build();
        }

        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .code(200)
                .user(userResponse)
                .build();
    }
    
    @Override
    public AuthResponse handleGoogleLogin(GoogleUser dto) {

        User user = userRepository.findByEmail(dto.getEmail());

        if (user == null) {

            user = new User();
            user.setFullName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setPasswordHash(null);
            user.setRole("USER");
            user.setProvider("google");
            user.setProviderId(dto.getProviderId());
            user.setIsActive(true);
            user.setLastLogin(java.time.LocalDateTime.now());
            user.setTenantId(generateTenantId());
            user.setReferralCode(generateReferralCode());

            userRepository.save(user);
        } 
        
        else {

            if (user.getProvider() == null) {
                user.setProvider("google");
                user.setProviderId(dto.getProviderId());
            }

            user.setLastLogin(java.time.LocalDateTime.now());

            userRepository.save(user);
        }

        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .success(true)
                .message("Google login successful")
                .code(200)
                .user(userResponse)
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
    
    private String generateReferralCode() {
        String code;
        do {
            code = "REF" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (userRepository.existsByReferralCode(code));
        return code;
    }
    
    private UUID generateTenantId() {
        return UUID.randomUUID();
    }
}