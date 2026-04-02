package com.repair.server.service;

import com.repair.server.dto.*;
import com.repair.server.model.RepairOrder;
import com.repair.server.model.OrderStatus;
import com.repair.server.model.Evaluation;
import com.repair.server.model.OrderPriority;

import java.util.List;

public interface RepairOrderService {

    /**
     * 创建报修单
     */
    RepairOrder createOrder(CreateOrderRequest request, Long userId);

    /**
     * 查询某人的工单
     */
    List<RepairOrder> getOrdersByAuthor(Long userId);

    /**
     * 管理员：获取所有工单 (支持按状态/优先级筛选)
     */
    List<RepairOrder> getAllOrders(OrderStatus status, OrderPriority priority);

    /**
     * 管理员：指派维修人员
     */
    RepairOrder assignWorker(Long orderId, AssignOrderRequest request);

    /**
     * 管理员：更新状态 (如改为 已完成)
     */
    RepairOrder updateStatus(Long orderId, OrderStatus status);

    /**
     * 管理员：更新优先级
     */
    RepairOrder updatePriority(Long orderId, OrderPriority priority);

    /**
     * 业主：取消工单
     */
    RepairOrder cancelOrder(Long orderId);

    /**
     * 业主：评价工单
     */
    Evaluation evaluateOrder(Long orderId, CreateEvaluationRequest request, Long userId);

    /**
     * 管理员：获取仪表盘统计数据 (扩展版)
     */
    DashboardStats getDashboardStats();

    /**
     * 获取工单详情
     */
    RepairOrder getOrderById(Long orderId);

    // ===================== 以下为新增方法 =====================

    /**
     * 管理员：向业主发起撤销请求
     * @param orderId 工单ID
     * @param reason 撤销原因
     * @return 更新后的工单
     */
    RepairOrder requestCancellation(Long orderId, String reason);

    /**
     * 业主：响应管理员的撤销请求
     * @param orderId 工单ID
     * @param agree true=同意撤销, false=拒绝撤销
     * @param userId 当前业主ID (用于权限校验)
     * @return 更新后的工单
     */
    RepairOrder respondToCancellation(Long orderId, boolean agree, Long userId);

    /**
     * Dashboard：获取本周趋势数据 (周一~周日每天的待处理和已完成数)
     */
    List<WeeklyTrend> getWeeklyTrends();

    /**
     * Dashboard：获取报修类型占比统计
     */
    List<CategoryStat> getCategoryStats();

    /**
     * Dashboard：获取本周重点关注工单
     * @param priority 优先级筛选 (可选)
     * @param limit 返回数量限制
     */
    List<RepairOrder> getWeeklyFocusOrders(OrderPriority priority, int limit);
}