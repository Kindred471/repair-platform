package com.repair.server.service;

import com.repair.server.dto.*; // 偷懒写法：导入所有DTO

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    // === 必须补上这两个新方法的定义 ===

    void logout(String accessToken);

    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
}