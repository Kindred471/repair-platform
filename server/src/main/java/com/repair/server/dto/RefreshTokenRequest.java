package com.repair.server.dto;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken; // 前端发来这个，想换新的 access token
}