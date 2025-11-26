package com.repair.server.service.impl;

import com.repair.server.dto.*;
import com.repair.server.exception.BusinessException;
import com.repair.server.model.Role;
import com.repair.server.model.User;
import com.repair.server.repository.UserRepository;
import com.repair.server.service.AuthService;
import com.repair.server.utils.JwtUtils;
import com.repair.server.utils.RedisUtils;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final RedisUtils redisUtils;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessException("注册失败：用户名已存在");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RESIDENT); // 默认注册为业主

        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. 找用户
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("登录失败：用户名或密码错误"));

        // 2. 校验密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("登录失败：用户名或密码错误");
        }

        // =========================================================
        // 核心融合：管理员单点登录 (立即踢掉旧设备)
        // =========================================================
        if (user.getRole() == Role.ADMIN) {
            // 这个 Key 专门用来记录管理员当前正在用的 Access Token
            String adminKey = "login_admin:" + user.getId();
            String oldAccessToken = redisUtils.get(adminKey);

            if (oldAccessToken != null) {
                // 狠一点：直接把旧 Access Token 拉黑，对方请求立刻报 403
                // 过期时间设为 Access Token 的剩余最大寿命即可 (这里简单设为 15分钟)
                redisUtils.set("blacklist:" + oldAccessToken, "1", JwtUtils.ACCESS_EXPIRE, TimeUnit.MILLISECONDS);
            }
        }
        // =========================================================

        // 3. 生成双 Token
        String accessToken = jwtUtils.createAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtils.createRefreshToken(user.getId());

        // 4. 存储 Refresh Token (用于续命 - 白名单机制)
        // Key: "refresh_token:{uid}" -> Value: refreshToken
        String refreshKey = "refresh_token:" + user.getId();
        redisUtils.set(refreshKey, refreshToken, JwtUtils.REFRESH_EXPIRE, TimeUnit.MILLISECONDS);

        // 5. 如果是管理员，还需要记录新的 Access Token (用于下次被踢)
        if (user.getRole() == Role.ADMIN) {
            String adminKey = "login_admin:" + user.getId();
            // 记录下来，有效期跟 Access Token 一样长就行，或者长一点也无所谓
            redisUtils.set(adminKey, accessToken, JwtUtils.ACCESS_EXPIRE, TimeUnit.MILLISECONDS);
        }

        // 6. 返回结果
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String incomingRefreshToken = request.getRefreshToken();

        // 1. 校验格式
        Claims claims;
        try {
            claims = jwtUtils.parseToken(incomingRefreshToken);
        } catch (Exception e) {
            throw new BusinessException(401, "Refresh Token 无效或已过期");
        }

        String userId = claims.getSubject();

        // 2. 校验 Redis 白名单 (核心：登出或被顶号后，Redis 里就没有了)
        String refreshKey = "refresh_token:" + userId;
        String savedRefreshToken = redisUtils.get(refreshKey);

        if (savedRefreshToken == null || !savedRefreshToken.equals(incomingRefreshToken)) {
            throw new BusinessException(401, "令牌已失效，请重新登录");
        }

        // 3. 生成新的 Access Token
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new BusinessException("用户不存在"));

        String newAccessToken = jwtUtils.createAccessToken(user.getId(), user.getRole().name());

        // (如果是管理员，这里其实也可以更新一下 login_admin:{id}，但通常为了简单，踢人只在登录时触发)

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

    @Override
    public void logout(String accessToken) {
        // 注意：前端传过来的是 Access Token
        try {
            // 1. 把 Access Token 拉黑
            Claims claims = jwtUtils.parseToken(accessToken);
            long ttl = claims.getExpiration().getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                redisUtils.set("blacklist:" + accessToken, "1", ttl, TimeUnit.MILLISECONDS);
            }

            // 2. 把 Redis 里的 Refresh Token 删掉 (彻底断了续命的路)
            String userId = claims.getSubject();
            redisUtils.delete("refresh_token:" + userId);

            // 3. (可选) 把管理员的追踪记录也删了
            redisUtils.delete("login_admin:" + userId);

        } catch (Exception e) {
            // 忽略解析错误，反正目的是登出
        }
    }
}