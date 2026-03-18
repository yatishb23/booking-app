package com.yatish.service;

import java.util.List;
import java.util.UUID;


import com.yatish.dto.request.UpdateUserRequest;
import com.yatish.dto.response.AuthResponse;
import com.yatish.model.User;

import jakarta.validation.Valid;

public interface UserService {
	List<User> getAllUsers();

	AuthResponse getUserById(Integer id);

	AuthResponse changeUserRole(Integer id, String role);

	AuthResponse updateUserStatus(Integer id, boolean active);

	AuthResponse approveOrganizer(Integer id);

	AuthResponse deleteUser(Integer id);

	void requestOrganizer(String jwt);

	AuthResponse updateUser(UUID id, @Valid UpdateUserRequest request);

	AuthResponse updateUser(Integer id, @Valid UpdateUserRequest request);

}
