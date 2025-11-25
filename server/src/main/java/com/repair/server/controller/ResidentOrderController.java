package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.CreateEvaluationRequest;
import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.model.Evaluation;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.RepairOrderService;
import com.repair.server.utils.SecurityUtils; // 1. 引入我们封装的工具类
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
     */
    @PostMapping
    public Result<RepairOrder> createOrder(@RequestBody CreateOrderRequest request) {
        // 修改点：不再写死 ID，而是从 Token 获取
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.createOrder(request, userId));
    }

    /**
     * 2. 获取我的工单列表
     */
    @GetMapping
    public Result<List<RepairOrder>> getMyOrders() {
        // 修改点：获取当前登录用户的所有工单
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.getOrdersByAuthor(userId));
    }

    /**
     * 3. 取消工单
     */
    @PatchMapping("/{id}/cancel")
    public Result<RepairOrder> cancelOrder(@PathVariable Long id) {
        // 注意：实际生产中，Service 层这里最好也能校验一下 userId，防止A用户取消了B用户的单子
        // 但目前先保持基础逻辑
        return Result.success(repairOrderService.cancelOrder(id));
    }

    /**
     * 4. 评价工单
     */
    @PostMapping("/{id}/evaluation")
    public Result<Evaluation> evaluateOrder(@PathVariable Long id, @RequestBody CreateEvaluationRequest request) {
        // 修改点：传入当前用户 ID，确保是本人在评价
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(repairOrderService.evaluateOrder(id, request, userId));
    }

}