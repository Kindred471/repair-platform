package com.repair.server.config;

import com.repair.server.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
                // 0. 启用 CORS (使用 CorsConfig 中定义的 CorsFilter Bean)
                .cors(Customizer.withDefaults())

                // 1. 关闭 CSRF (前后端分离项目不需要)
                .csrf(csrf -> csrf.disable())

                // 2. 设置 Session 为无状态 (因为我们用 JWT，不存 Session)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. 配置拦截规则
                .authorizeHttpRequests(auth -> auth
                        // A. 放行登录注册 (所有人都能访问)
                        .requestMatchers("/api/auth/**").permitAll()

                        // B. 管理员接口只有管理员能访问
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // C. 其他所有接口都需要登录 (不管角色)
                        .anyRequest().authenticated()
                )

                // 4. 把我们的 JWT 过滤器加到 UsernamePasswordAuthenticationFilter 之前
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}