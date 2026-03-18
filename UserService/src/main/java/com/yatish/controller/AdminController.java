package com.yatish.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yatish.dto.response.AuthResponse;
import com.yatish.dto.response.UserResponse;
import com.yatish.model.User;
import com.yatish.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthResponse> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<AuthResponse> changeUserRole(
            @PathVariable Integer id,
            @RequestParam String role) {

        return ResponseEntity.ok(userService.changeUserRole(id, role));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AuthResponse> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam boolean active) {

        return ResponseEntity.ok(userService.updateUserStatus(id, active));
    }

    @PutMapping("/{id}/approve-organizer")
    public ResponseEntity<AuthResponse> approveOrganizer(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.approveOrganizer(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}