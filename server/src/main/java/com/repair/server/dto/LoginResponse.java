package com.repair.server.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String accessToken;  // 改名：明确叫 accessToken
    private String refreshToken; // 新增：长命令牌
    private Long id;
    private String username;
    private String role;
}