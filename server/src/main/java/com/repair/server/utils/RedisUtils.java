package com.repair.server.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisUtils {

    // Spring 自带的操作 Redis 的客户端
    private final StringRedisTemplate redisTemplate;

    /**
     * 1. 存入数据 (默认不过期)
     */
    public void set(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 2. 存入数据 (带过期时间) -> 这是做“登出”功能的关键！
     * @param timeout 过期时间(秒)
     */
    public void set(String key, String value, long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.SECONDS);
    }

    /**
     * 3. 获取数据
     */
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * 4. 检查 key 是否存在
     */
    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * 5. 删除数据
     */
    public void delete(String key) {
        redisTemplate.delete(key);
    }
    /**
     * 新增：存入数据 (支持自定义时间单位，如毫秒)
     * @param key 键
     * @param value 值
     * @param timeout 过期时间
     * @param unit 时间单位 (TimeUnit.SECONDS / TimeUnit.MILLISECONDS)
     */
    public void set(String key, String value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }
}