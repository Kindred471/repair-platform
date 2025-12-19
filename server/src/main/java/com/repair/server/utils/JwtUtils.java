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

@Component
public class JwtUtils {

    private static final String SECRET = "IamLuoHaoIamVErysuperhandsomegayyouknow";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // === 核心变化：两个过期时间 ===
    // Access Token: 15分钟 (短命，用于业务请求)
    public static final long ACCESS_EXPIRE = 15 * 60 * 1000L;

    // Refresh Token: 7天 (长命，只用于换新 Access Token)
    public static final long REFRESH_EXPIRE = 7 * 24 * 60 * 60 * 1000L;

    /**
     * 通用生成方法
     * @param userId 用户ID
     * @param role 角色
     * @param expiration 过期时间(毫秒)
     */
    public String generateToken(Long userId, String role, long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 生成 Access Token
    public String createAccessToken(Long userId, String role) {
        return generateToken(userId, role, ACCESS_EXPIRE);
    }

    // 生成 Refresh Token
    public String createRefreshToken(Long userId) {
        // Refresh Token 不需要存 Role，只要能证明身份就行，甚至 claims 空着也可以
        return generateToken(userId, null, REFRESH_EXPIRE);
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}