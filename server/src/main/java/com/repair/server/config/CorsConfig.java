package com.repair.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 允许的前端域名 (从配置文件读取，支持环境变量覆盖)
        config.setAllowedOrigins(allowedOrigins);

        // 允许的请求方法
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 允许的请求头
        config.setAllowedHeaders(Arrays.asList("*"));

        // 允许携带凭证 (Cookie / Authorization Header)
        config.setAllowCredentials(true);

        // 暴露的响应头 (前端可以读到)
        config.setExposedHeaders(Arrays.asList("Authorization"));

        // 预检请求缓存时间 (秒)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
