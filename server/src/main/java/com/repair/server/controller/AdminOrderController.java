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

    @GetMapping("/stats")
    public Result<DashboardStats> getStats() {
        return Result.success(repairOrderService.getDashboardStats());
    }

    @GetMapping("/favorites")
    public Result<List<Favorite>> getFavorites() {
        return Result.success(favoriteService.getMyFavorites(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping
    public Result<List<RepairOrder>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) OrderPriority priority
    ) {
        return Result.success(repairOrderService.getAllOrders(status, priority));
    }

    /**
     * 获取单个工单详情
     * URL: GET /api/admin/orders/{id}
     */
    @GetMapping("/{id}")
    public Result<RepairOrder> getOrderById(@PathVariable Long id) {
        // 调用 Service 层的 getOrderById 方法
        return Result.success(repairOrderService.getOrderById(id));
    }
    @PatchMapping("/{id}/assign")
    public Result<RepairOrder> assignOrder(@PathVariable Long id, @RequestBody AssignOrderRequest request) {
        return Result.success(repairOrderService.assignWorker(id, request));
    }

    @PatchMapping("/{id}/status")
    public Result<RepairOrder> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return Result.success(repairOrderService.updateStatus(id, request.getStatus()));
    }

    @PatchMapping("/{id}/priority")
    public Result<RepairOrder> updatePriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request) {
        return Result.success(repairOrderService.updatePriority(id, request.getPriority()));
    }

    @PostMapping("/favorites/{orderId}")
    public Result<Void> addFavorite(@PathVariable Long orderId) {
        favoriteService.addFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }

    @DeleteMapping("/favorites/{orderId}")
    public Result<Void> removeFavorite(@PathVariable Long orderId) {
        favoriteService.removeFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }
}