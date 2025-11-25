package com.repair.server.filter;

import com.repair.server.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.repair.server.utils.RedisUtils;

import java.io.IOException;
import java.util.ArrayList;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // 记得导包
import java.util.Collections; // 记得导包
import java.util.List; // 记得导包

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final RedisUtils redisUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. 从请求头获取 Token
        String token = getTokenFromRequest(request);

        // 2. 如果 Token 存在且有效
        if (StringUtils.hasText(token)) {
            if (redisUtils.hasKey("blacklist:" + token)) {
                // 如果在黑名单里，直接当做无效，不走下面的解析逻辑
                // 这里什么都不做，SecurityContext 没东西，后面自然会报 403/401
                filterChain.doFilter(request, response);
                return;
            }
            try {
                // 1. 解析 Token
                Claims claims = jwtUtils.parseToken(token);
                String userId = claims.getSubject();

                // === 修改开始：提取角色 ===
                String role = (String) claims.get("role"); // 获取我们在 JwtUtils 里存进去的 "ADMIN" 或 "RESIDENT"

                // Spring Security 的标准玩法：角色前面要加 "ROLE_" 前缀
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(authority);
                // ========================

                // 2. 告诉 Spring Security：这个人是谁(userId)，他有什么权限(authorities)
                // 注意：这里第3个参数不再是 new ArrayList<>()，而是上面的 authorities
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                logger.error("Token 无效: " + e.getMessage());
            }
        }

        // 4. 放行 (交给下一个过滤器或 Controller)
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // 标准格式是 "Bearer <token>"
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}