package com.repair.server.service.impl;

import com.repair.server.dto.LoginRequest;
import com.repair.server.dto.LoginResponse;
import com.repair.server.dto.RegisterRequest;
import com.repair.server.exception.BusinessException;
import com.repair.server.model.Role;
import com.repair.server.model.User;
import com.repair.server.repository.UserRepository;
import com.repair.server.service.AuthService;
import com.repair.server.utils.JwtUtils;
import com.repair.server.utils.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;
import io.jsonwebtoken.Claims;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    // 密码加密器：它会把 "123456" 变成一串看不懂的乱码 "$2a$10$..."
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RedisUtils redisUtils;

    @Override
    public void register(RegisterRequest request) {
        // 1. 检查用户名是否重复
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessException("注册失败：用户名已存在");
        }

        // 2. 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        // 重点：加密密码！
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RESIDENT); // 默认注册为业主

        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. 找用户
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("登录失败：用户名或密码错误"));

        // 2. 校验密码 (用 matches 方法比较 明文 和 密文)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("登录失败：用户名或密码错误");
        }

        // 3. 生成 Token
        String token = jwtUtils.generateToken(user.getId(), user.getRole().name());

        // 4. 返回结果
        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
    @Override
    public void logout(String token) {
        // 1. 解析 Token 获取过期时间
        // 注意：这里可能会抛异常(如果Token已过期)，可以try-catch处理，也可以直接让它抛出
        Claims claims = jwtUtils.parseToken(token);
        long expirationTime = claims.getExpiration().getTime();
        long currentTime = System.currentTimeMillis();

        // 2. 计算剩余时间 (毫秒)
        long ttl = expirationTime - currentTime;

        // 3. 如果 Token 还没过期，就把它加入黑名单
        if (ttl > 0) {
            // Key: "blacklist:" + token
            // Value: "1" (内容无所谓，我们要的是 key 存在)
            // Time: ttl (单位: 毫秒)
            redisUtils.set("blacklist:" + token, "1", ttl, TimeUnit.MILLISECONDS);
        }
    }
}