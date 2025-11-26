package com.repair.server.config;

import com.repair.server.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 1. 导入这个
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. 关闭 CSRF (前后端分离项目不需要)
                .csrf(csrf -> csrf.disable())

                // 2. 设置 Session 为无状态 (因为我们用 JWT，不存 Session)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. 配置拦截规则
                .authorizeHttpRequests(auth -> auth
                        // A. 放行登录注册 (所有人都能访问)
                        .requestMatchers("/api/auth/**").permitAll()

                        // B. === 关键修改：管理员接口只有管理员能访问 ===
                        // 注意：hasRole("ADMIN") 会自动检查是否有 "ROLE_ADMIN" 权限
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // C. 业主接口 (可选，如果不加这行，管理员也能访问业主接口，通常没问题)
                        // .requestMatchers("/api/orders/**").hasRole("RESIDENT")

                        // D. 其他所有接口都需要登录 (不管角色)
                        .anyRequest().authenticated()
                )

                // 4. 把我们的 JWT 过滤器加到 UsernamePasswordAuthenticationFilter 之前
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}