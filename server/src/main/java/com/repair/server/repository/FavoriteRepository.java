package com.repair.server.repository;

import com.repair.server.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 查找某个管理员收藏的所有记录
    List<Favorite> findByAdminIdOrderByCreatedAtDesc(Long adminId);

    // 检查某个管理员是否收藏了某个特定的工单 (防止重复收藏)
    Optional<Favorite> findByAdminIdAndOrderId(Long adminId, Long orderId);
}