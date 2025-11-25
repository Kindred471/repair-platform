package com.repair.server.utils;

import com.repair.server.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    /**
     * 从 SecurityContext 中获取当前登录用户的 ID
     * @return userId
     */
    public static Long getCurrentUserId() {
        // 1. 获取认证信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. 校验是否为空 (防止未登录访问)
        if (authentication == null || authentication.getPrincipal() == null || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BusinessException(401, "未登录或登录已过期");
        }

        try {
            // 3. 我们在 JwtAuthenticationFilter 里存的是 String 类型的 ID
            String userIdStr = (String) authentication.getPrincipal();
            return Long.parseLong(userIdStr);
        } catch (Exception e) {
            throw new BusinessException(401, "身份信息无效");
        }
    }
}