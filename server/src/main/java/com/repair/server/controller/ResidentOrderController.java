package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.CancellationResponseRequest;
import com.repair.server.dto.CreateEvaluationRequest;
import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.model.Evaluation;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.RepairOrderService;
import com.repair.server.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class ResidentOrderController {

    private final RepairOrderService repairOrderService;

    /**
     * 1. 提交报修单
     * POST /api/orders
     */
    @PostMapping
    public Result<RepairOrder> createOrder(@RequestBody CreateOrderRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.createOrder(request, userId));
    }

    /**
     * 2. 获取我的工单列表
     * GET /api/orders
     */
    @GetMapping
    public Result<List<RepairOrder>> getMyOrders() {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.getOrdersByAuthor(userId));
    }

    /**
     * 3. 获取单个工单详情
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public Result<RepairOrder> getOrderById(@PathVariable Long id) {
        return Result.success(repairOrderService.getOrderById(id));
    }

    /**
     * 4. 取消工单
     * PATCH /api/orders/{id}/cancel
     */
    @PatchMapping("/{id}/cancel")
    public Result<RepairOrder> cancelOrder(@PathVariable Long id) {
        return Result.success(repairOrderService.cancelOrder(id));
    }

    /**
     * 5. 评价工单
     * POST /api/orders/{id}/evaluation
     */
    @PostMapping("/{id}/evaluation")
    public Result<Evaluation> evaluateOrder(@PathVariable Long id, @RequestBody CreateEvaluationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.evaluateOrder(id, request, userId));
    }

    /**
     * 6. 响应管理员的撤销请求 (新增)
     * PATCH /api/orders/{id}/cancellation-response
     */
    @PatchMapping("/{id}/cancellation-response")
    public Result<RepairOrder> respondToCancellation(@PathVariable Long id, @RequestBody CancellationResponseRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.respondToCancellation(id, request.getAgree(), userId));
    }
}