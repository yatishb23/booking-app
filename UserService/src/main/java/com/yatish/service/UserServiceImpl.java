package com.yatish.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yatish.dto.request.UpdateUserRequest;
import com.yatish.dto.response.AuthResponse;
import com.yatish.dto.response.UserResponse;
import com.yatish.model.User;
import com.yatish.repository.UserRepository;

import jakarta.validation.Valid;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private AuthResponse failure(String message, int code) {
        return AuthResponse.builder()
                .success(false)
                .message(message)
                .code(code)
                .user(null)
                .build();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public AuthResponse getUserById(Integer id) {
        try {
            User user = userRepository.findById(id).orElse(null);

            if (user == null) {
                return failure("User not found", 404);
            }

            return AuthResponse.builder()
                    .success(true)
                    .message("User fetched successfully")
                    .code(200)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            return failure("Something went wrong while fetching user", 500);
        }
    }

    @Override
    public AuthResponse changeUserRole(Integer id, String role) {
        try {
            User user = userRepository.findById(id).orElse(null);

            if (user == null) {
                return failure("User not found", 404);
            }

            user.setRole(role);
            userRepository.save(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("Role updated successfully to " + role)
                    .code(200)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            return failure("Failed to update role", 500);
        }
    }

    @Override
    public AuthResponse updateUserStatus(Integer id, boolean active) {
        try {
            User user = userRepository.findById(id).orElse(null);

            if (user == null) {
                return failure("User not found", 404);
            }

            user.setIsActive(active);
            userRepository.save(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("User status updated to " + (active ? "active" : "inactive"))
                    .code(200)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            return failure("Failed to update status", 500);
        }
    }

    @Override
    public AuthResponse approveOrganizer(Integer id) {
        try {
            User user = userRepository.findById(id).orElse(null);

            if (user == null) {
                return failure("User not found", 404);
            }

            user.setRole("ORGANIZER");
            userRepository.save(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("User approved as ORGANIZER")
                    .code(200)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            return failure("Failed to approve organizer", 500);
        }
    }

    @Override
    public AuthResponse deleteUser(Integer id) {
        try {
            if (!userRepository.existsById(id)) {
                return failure("User not found", 404);
            }

            userRepository.deleteById(id);

            return AuthResponse.builder()
                    .success(true)
                    .message("User deleted successfully")
                    .code(200)
                    .user(null)
                    .build();

        } catch (Exception e) {
            return failure("Failed to delete user", 500);
        }
    }

    @Override
    public AuthResponse updateUser(Integer id, @Valid UpdateUserRequest request) {
        try {
            User user = userRepository.findById(id).orElse(null);

            if (user == null) {
                return failure("User not found", 404);
            }

            if (request.getFullName() != null) user.setFullName(request.getFullName());
            if (request.getLocale() != null) user.setLocale(request.getLocale());

            userRepository.save(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("User updated successfully")
                    .code(200)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            return failure("Failed to update user", 500);
        }
    }

    @Override
    public void requestOrganizer(String jwt) {
        // optional: decode JWT and mark request
        // not implemented yet
    }

    @Override
    public AuthResponse updateUser(UUID id, @Valid UpdateUserRequest request) {
        return failure("UUID based update not supported yet", 400);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}