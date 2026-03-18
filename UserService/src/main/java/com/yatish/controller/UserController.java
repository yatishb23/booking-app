package com.yatish.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yatish.dto.request.UpdateUserRequest;
import com.yatish.dto.response.AuthResponse;
import com.yatish.dto.response.UserResponse;
import com.yatish.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthResponse> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {

        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ✅ Request organizer role
    @PostMapping("/request-organizer")
    public ResponseEntity<String> requestOrganizerRole(
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", ""); // 🔥 important
        userService.requestOrganizer(jwt);

        return ResponseEntity.ok("Organizer request submitted");
    }
}