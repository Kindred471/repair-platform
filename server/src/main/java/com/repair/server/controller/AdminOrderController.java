package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.*;
import com.repair.server.model.Favorite;
import com.repair.server.model.OrderPriority;
import com.repair.server.model.OrderStatus;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.FavoriteService;
import com.repair.server.service.RepairOrderService;
import com.repair.server.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final RepairOrderService repairOrderService;
    private final FavoriteService favoriteService;

    // ===================== 原有接口 =====================

    /**
     * 获取仪表盘统计数据 (扩展版)
     * GET /api/admin/orders/stats
     */
    @GetMapping("/stats")
    public Result<DashboardStats> getStats() {
        return Result.success(repairOrderService.getDashboardStats());
    }

    /**
     * 获取管理员收藏的工单列表
     * GET /api/admin/orders/favorites
     */
    @GetMapping("/favorites")
    public Result<List<Favorite>> getFavorites() {
        return Result.success(favoriteService.getMyFavorites(SecurityUtils.getCurrentUserId()));
    }

    /**
     * 获取所有工单 (支持筛选)
     * GET /api/admin/orders?status=PENDING&priority=P0
     */
    @GetMapping
    public Result<List<RepairOrder>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) OrderPriority priority
    ) {
        return Result.success(repairOrderService.getAllOrders(status, priority));
    }

    /**
     * 获取单个工单详情
     * GET /api/admin/orders/{id}
     */
    @GetMapping("/{id}")
    public Result<RepairOrder> getOrderById(@PathVariable Long id) {
        return Result.success(repairOrderService.getOrderById(id));
    }

    /**
     * 指派维修人员并开始处理
     * PATCH /api/admin/orders/{id}/assign
     */
    @PatchMapping("/{id}/assign")
    public Result<RepairOrder> assignOrder(@PathVariable Long id, @RequestBody AssignOrderRequest request) {
        return Result.success(repairOrderService.assignWorker(id, request));
    }

    /**
     * 更新工单状态
     * PATCH /api/admin/orders/{id}/status
     */
    @PatchMapping("/{id}/status")
    public Result<RepairOrder> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return Result.success(repairOrderService.updateStatus(id, request.getStatus()));
    }

    /**
     * 设置工单优先级
     * PATCH /api/admin/orders/{id}/priority
     */
    @PatchMapping("/{id}/priority")
    public Result<RepairOrder> updatePriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request) {
        return Result.success(repairOrderService.updatePriority(id, request.getPriority()));
    }

    /**
     * 收藏一个工单
     * POST /api/admin/orders/favorites/{orderId}
     */
    @PostMapping("/favorites/{orderId}")
    public Result<Void> addFavorite(@PathVariable Long orderId) {
        favoriteService.addFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }

    /**
     * 取消收藏一个工单
     * DELETE /api/admin/orders/favorites/{orderId}
     */
    @DeleteMapping("/favorites/{orderId}")
    public Result<Void> removeFavorite(@PathVariable Long orderId) {
        favoriteService.removeFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }

    // ===================== 新增接口 =====================

    /**
     * 向业主发起撤销请求
     * POST /api/admin/orders/{id}/request-cancellation
     */
    @PostMapping("/{id}/request-cancellation")
    public Result<RepairOrder> requestCancellation(@PathVariable Long id, @RequestBody CancellationRequest request) {
        return Result.success(repairOrderService.requestCancellation(id, request.getReason()));
    }

    /**
     * 获取本周趋势数据
     * GET /api/admin/orders/trends/weekly
     */
    @GetMapping("/trends/weekly")
    public Result<List<WeeklyTrend>> getWeeklyTrends() {
        return Result.success(repairOrderService.getWeeklyTrends());
    }

    /**
     * 获取报修类型占比统计
     * GET /api/admin/orders/category-stats
     */
    @GetMapping("/category-stats")
    public Result<List<CategoryStat>> getCategoryStats() {
        return Result.success(repairOrderService.getCategoryStats());
    }

    /**
     * 获取本周重点关注工单
     * GET /api/admin/orders/weekly-focus?priority=P0&limit=10
     */
    @GetMapping("/weekly-focus")
    public Result<List<RepairOrder>> getWeeklyFocusOrders(
            @RequestParam(required = false) OrderPriority priority,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return Result.success(repairOrderService.getWeeklyFocusOrders(priority, limit));
    }
}