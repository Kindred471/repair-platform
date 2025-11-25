package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.LoginRequest;
import com.repair.server.dto.LoginResponse;
import com.repair.server.dto.RegisterRequest;
import com.repair.server.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.repair.server.utils.RedisUtils;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RedisUtils redisUtils;

    @PostMapping("/register")
    public Result<Void> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return Result.success(null);
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }
    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        // 1. 从请求头拿到 "Bearer xxxx"
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            // 2. 执行登出
            authService.logout(token);
        }

        return Result.success(null);
    }
}