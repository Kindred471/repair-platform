package com.repair.server.controller;

import com.repair.server.common.Result;
import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.model.RepairOrder;
import com.repair.server.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.repair.server.dto.CreateEvaluationRequest;
import com.repair.server.model.Evaluation;

import java.util.List;

@RestController
@RequestMapping("/api/orders") // 对应文档的根路径
@RequiredArgsConstructor
// @CrossOrigin(origins = "*") // 如果你之后前后端联调遇到跨域问题，把这行注释解开
public class ResidentOrderController {

    private final RepairOrderService repairOrderService;

    // 1. 提交报修单接口
    @PostMapping
    public Result<RepairOrder> createOrder(@RequestBody CreateOrderRequest request) {
        // 暂时写死 userId = 1 (模拟当前登录用户)
        Long mockUserId = 1L;

        RepairOrder order = repairOrderService.createOrder(request, mockUserId);
        return Result.success(order);
    }

    // 2. 获取我的工单列表接口
    @GetMapping
    public Result<List<RepairOrder>> getMyOrders() {
        // 暂时写死 userId = 1
        Long mockUserId = 1L;

        List<RepairOrder> list = repairOrderService.getOrdersByAuthor(mockUserId);
        return Result.success(list);
    }
    // 3. 取消工单
    @PatchMapping("/{id}/cancel")
    public Result<RepairOrder> cancelOrder(@PathVariable Long id) {
        RepairOrder order = repairOrderService.cancelOrder(id);
        return Result.success(order);
    }

    // 4. 评价工单
    @PostMapping("/{id}/evaluation")
    public Result<Evaluation> evaluateOrder(@PathVariable Long id, @RequestBody CreateEvaluationRequest request) {
        // 暂时写死 ID=1
        Long mockUserId = 1L;

        Evaluation evaluation = repairOrderService.evaluateOrder(id, request, mockUserId);
        return Result.success(evaluation);
    }
}