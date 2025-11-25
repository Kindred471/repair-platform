package com.repair.server.service;

import com.repair.server.dto.LoginRequest;
import com.repair.server.dto.LoginResponse;
import com.repair.server.dto.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void logout(String token);
}