package com.repair.server.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component // 交给 Spring 管理，方便到处注入使用
public class JwtUtils {

    // 密钥：这一串字符越长越乱越安全，千万别告诉别人
    private static final String SECRET = "MySuperSecretKeyForRepairPlatformProject2025";

    // 过期时间：24小时 (毫秒)
    private static final long EXPIRATION = 24 * 60 * 60 * 1000L;

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    /**
     * 生成 Token
     * @param userId 用户ID
     * @param role 角色 (RESIDENT/ADMIN)
     */
    public String generateToken(Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // 把角色存进去，以后方便鉴权

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId)) // 把 ID 存为 "Subject" (核心内容)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 解析 Token (验证身份证真伪)
     */
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}