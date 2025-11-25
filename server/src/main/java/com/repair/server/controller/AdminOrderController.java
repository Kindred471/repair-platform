package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.AssignOrderRequest;
import com.repair.server.dto.UpdateStatusRequest;
import com.repair.server.model.Favorite;
import com.repair.server.model.OrderPriority;
import com.repair.server.model.OrderStatus;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.FavoriteService;
import com.repair.server.service.RepairOrderService;
import com.repair.server.utils.SecurityUtils; // 1. 记得引入工具类
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.repair.server.dto.UpdatePriorityRequest;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final RepairOrderService repairOrderService;
    private final FavoriteService favoriteService;

    // ... 前面的 getAllOrders, assignOrder, updateStatus 不需要改 (因为它们不需要当前管理员ID) ...

    // 获取所有工单 (支持筛选)
    @GetMapping
    public Result<List<RepairOrder>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) OrderPriority priority // 新增这个参数
    ) {
        return Result.success(repairOrderService.getAllOrders(status, priority));
    }

    @PatchMapping("/{id}/assign")
    public Result<RepairOrder> assignOrder(@PathVariable Long id, @RequestBody AssignOrderRequest request) {
        return Result.success(repairOrderService.assignWorker(id, request));
    }

    @PatchMapping("/{id}/status")
    public Result<RepairOrder> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return Result.success(repairOrderService.updateStatus(id, request.getStatus()));
    }

    // === 修改重点在这里 ===

    @GetMapping("/favorites")
    public Result<List<Favorite>> getFavorites() {
        // 使用 SecurityUtils 替换 mockAdminId
        return Result.success(favoriteService.getMyFavorites(SecurityUtils.getCurrentUserId()));
    }

    @PostMapping("/favorites/{orderId}")
    public Result<Void> addFavorite(@PathVariable Long orderId) {
        // 使用 SecurityUtils 替换 mockAdminId
        favoriteService.addFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }

    @DeleteMapping("/favorites/{orderId}")
    public Result<Void> removeFavorite(@PathVariable Long orderId) {
        // 使用 SecurityUtils 替换 mockAdminId
        favoriteService.removeFavorite(orderId, SecurityUtils.getCurrentUserId());
        return Result.success(null);
    }
    // 设置工单优先级
    @PatchMapping("/{id}/priority")
    public Result<RepairOrder> updatePriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request) {
        // 这里的 SecurityUtils.getCurrentUserId() 虽然没传给 Service，
        // 但前面的 SecurityConfig 已经保证了只有管理员能调这个接口，所以是安全的。
        return Result.success(repairOrderService.updatePriority(id, request.getPriority()));
    }
}