package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.AssignOrderRequest;
import com.repair.server.dto.UpdateStatusRequest;
import com.repair.server.model.OrderStatus;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.repair.server.model.Favorite; // 新增
import com.repair.server.service.FavoriteService; // 新增
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final RepairOrderService repairOrderService;
    private final FavoriteService favoriteService; // 注入新 Service

    // 1. 获取所有工单 (支持筛选 ?status=PENDING)
    @GetMapping
    public Result<List<RepairOrder>> getAllOrders(@RequestParam(required = false) OrderStatus status) {
        List<RepairOrder> list = repairOrderService.getAllOrders(status);
        return Result.success(list);
    }

    // 2. 指派维修人员
    @PatchMapping("/{id}/assign")
    public Result<RepairOrder> assignOrder(@PathVariable Long id, @RequestBody AssignOrderRequest request) {
        RepairOrder order = repairOrderService.assignWorker(id, request);
        return Result.success(order);
    }

    // 3. 更新状态 (例如：把工单改为 COMPLETED)
    @PatchMapping("/{id}/status")
    public Result<RepairOrder> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        RepairOrder order = repairOrderService.updateStatus(id, request.getStatus());
        return Result.success(order);
    }
    // 1. 获取我的收藏
    @GetMapping("/favorites") // URL: /api/admin/orders/favorites
    public Result<List<Favorite>> getFavorites() {
        Long mockAdminId = 1L; // 暂时写死
        return Result.success(favoriteService.getMyFavorites(mockAdminId));
    }

    // 2. 添加收藏
    @PostMapping("/favorites/{orderId}") // URL: /api/admin/orders/favorites/1
    public Result<Void> addFavorite(@PathVariable Long orderId) {
        Long mockAdminId = 1L;
        favoriteService.addFavorite(orderId, mockAdminId);
        return Result.success(null);
    }

    // 3. 取消收藏
    @DeleteMapping("/favorites/{orderId}") // URL: /api/admin/orders/favorites/1
    public Result<Void> removeFavorite(@PathVariable Long orderId) {
        Long mockAdminId = 1L;
        favoriteService.removeFavorite(orderId, mockAdminId);
        return Result.success(null);
    }
}