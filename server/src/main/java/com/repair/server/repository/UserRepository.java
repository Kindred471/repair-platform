package com.repair.server.repository;

import com.repair.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// <User, Long> 意思是我管理 User 表，主键是 Long 类型
public interface UserRepository extends JpaRepository<User, Long> {

    // 我们需要自定义一个方法：根据用户名查找用户 (用于登录)
    // Spring 会自动解析这个方法名生成 SQL：select * from users where username = ?
    Optional<User> findByUsername(String username);
}