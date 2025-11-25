package com.repair.server.service;

import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.dto.DashboardStats;
import com.repair.server.model.RepairOrder;
import com.repair.server.dto.AssignOrderRequest;
import com.repair.server.model.OrderStatus;
import com.repair.server.dto.CreateEvaluationRequest; // 新增
import com.repair.server.model.Evaluation;
import com.repair.server.model.OrderPriority;

import java.util.List;

public interface RepairOrderService {

    /**
     * 创建报修单
     * @param request 前端传来的参数
     * @param userId  当前登录的用户ID
     * @return 创建好的工单
     */
    RepairOrder createOrder(CreateOrderRequest request, Long userId);

    // 预留：查询某人的工单
    List<RepairOrder> getOrdersByAuthor(Long userId);
    /**
     * 管理员：获取所有工单 (支持按状态筛选)
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
    // 管理员：更新优先级
    RepairOrder updatePriority(Long orderId, OrderPriority priority);
    /**
     * 业主：取消工单
     */
    RepairOrder cancelOrder(Long orderId);

    /**
     * 业主：评价工单
     */
    Evaluation evaluateOrder(Long orderId, CreateEvaluationRequest request, Long userId);
    DashboardStats getDashboardStats();
}