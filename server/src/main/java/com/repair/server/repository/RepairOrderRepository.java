package com.repair.server.repository;

import com.repair.server.model.OrderPriority;
import com.repair.server.model.RepairOrder;
import com.repair.server.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, Long> {

    // 1. 查询某个业主的所有工单 (按创建时间倒序，最新的在前面)
    List<RepairOrder> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    // 2. 筛选功能：根据状态查询 (比如管理员查看所有 "待处理" 的单子)
    List<RepairOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    // 3. 统计功能：用于仪表盘 (统计有多少个 "待处理" 的单子)
    long countByStatus(OrderStatus status);

    // 4. 只按优先级查
    List<RepairOrder> findByPriorityOrderByCreatedAtDesc(OrderPriority priority);

    // 5. 同时按 状态 AND 优先级 查 (例如：查"待处理"且"P0紧急"的单子)
    List<RepairOrder> findByStatusAndPriorityOrderByCreatedAtDesc(OrderStatus status, OrderPriority priority);

    // ===================== 以下为 Dashboard 新增查询 =====================

    // 6. 统计某状态 + 更新日期范围内的数量 (用于本周完成数等)
    long countByStatusAndUpdatedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end);

    // 7. 统计某状态 + 创建日期范围内的数量 (用于昨日新增待处理数)
    long countByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end);

    // 8. 统计某优先级的数量 (用于 P0 紧急工单数)
    long countByPriority(OrderPriority priority);

    // 9. 统计某状态 + 创建日期早于某时间 (用于超时判断：处理中超过 7 天)
    long countByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime before);

    // 10. 查询日期范围内创建的工单 (用于趋势分析)
    List<RepairOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 11. 查询日期范围内更新状态的工单 (用于趋势分析 - 已完成)
    List<RepairOrder> findByStatusAndUpdatedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end);

    // 12. 本周重点关注工单：按优先级和状态筛选
    @Query("SELECT o FROM RepairOrder o WHERE o.priority IN :priorities " +
           "AND o.status IN ('PENDING', 'PROCESSING') " +
           "ORDER BY CASE o.priority WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 END, o.createdAt DESC")
    List<RepairOrder> findWeeklyFocusOrders(@Param("priorities") List<OrderPriority> priorities);
}