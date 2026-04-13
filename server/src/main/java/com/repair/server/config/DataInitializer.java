package com.repair.server.config;

import com.repair.server.model.Role;
import com.repair.server.model.User;
import com.repair.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器：应用启动时自动创建默认管理员账号（幂等）
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(DEFAULT_ADMIN_USERNAME).isPresent()) {
            log.info("管理员账号已存在，跳过创建");
            return;
        }

        User admin = new User();
        admin.setUsername(DEFAULT_ADMIN_USERNAME);
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);
        log.info("默认管理员账号已创建 (用户名: {}, 密码: {})", DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
    }
}
