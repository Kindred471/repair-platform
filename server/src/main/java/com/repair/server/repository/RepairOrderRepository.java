package com.repair.server.repository;

import com.repair.server.model.OrderPriority;
import com.repair.server.model.RepairOrder;
import com.repair.server.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, Long> {

    // 1. 查询某个业主的所有工单 (按创建时间倒序，最新的在前面)
    List<RepairOrder> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    // 2. 筛选功能：根据状态查询 (比如管理员查看所有 "待处理" 的单子)
    List<RepairOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    // 3. 统计功能：用于仪表盘 (统计有多少个 "待处理" 的单子)
    long countByStatus(OrderStatus status);
    // 1. 只按优先级查
    List<RepairOrder> findByPriorityOrderByCreatedAtDesc(OrderPriority priority);

    // 2. 同时按 状态 AND 优先级 查 (例如：查“待处理”且“P0紧急”的单子)
    List<RepairOrder> findByStatusAndPriorityOrderByCreatedAtDesc(OrderStatus status, OrderPriority priority);
}