package com.yatish.service;

import com.yatish.dto.request.GoogleUser;
import com.yatish.dto.request.LoginRequest;
import com.yatish.dto.request.SignupRequest;
import com.yatish.dto.response.AuthResponse;

public interface AuthService {

	AuthResponse signup(SignupRequest request);

	AuthResponse login(LoginRequest request);

	AuthResponse handleGoogleLogin(GoogleUser dto);

}
