package com.repair.server.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder // 这个注解让我们能用链式写法创建对象
public class LoginResponse {
    private String token;    // 身份证
    private Long id;         // 用户ID
    private String username; // 用户名
    private String role;     // 角色
}