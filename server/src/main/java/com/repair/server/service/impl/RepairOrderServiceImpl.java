package com.repair.server.service.impl;

import com.repair.server.dto.AssignOrderRequest;
import com.repair.server.dto.CreateEvaluationRequest;
import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.exception.BusinessException;
import com.repair.server.model.*;
import com.repair.server.repository.EvaluationRepository;
import com.repair.server.repository.RepairOrderRepository;
import com.repair.server.repository.UserRepository;
import com.repair.server.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairOrderServiceImpl implements RepairOrderService {

    private final RepairOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EvaluationRepository evaluationRepository;

    // ================= 业主端功能 =================

    @Override
    public RepairOrder createOrder(CreateOrderRequest request, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("提交失败：当前登录用户不存在"));

        RepairOrder order = new RepairOrder();
        order.setTitle(request.getTitle());
        order.setDescription(request.getDescription());
        order.setAddress(request.getAddress());
        order.setImages(request.getImages());

        // 初始状态
        order.setStatus(OrderStatus.PENDING);
        order.setAuthor(author);

        return orderRepository.save(order);
    }

    @Override
    public List<RepairOrder> getOrdersByAuthor(Long userId) {
        return orderRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public RepairOrder cancelOrder(Long orderId) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("取消失败：工单不存在"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("取消失败：只有'待处理'状态的工单可以取消");
        }

        order.setStatus(OrderStatus.CANCELED);
        return orderRepository.save(order);
    }

    @Override
    public Evaluation evaluateOrder(Long orderId, CreateEvaluationRequest request, Long userId) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("评价失败：工单不存在"));

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("评价失败：用户不存在"));

        // 1. 状态校验
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BusinessException("评价失败：工单尚未完成，无法评价");
        }

        // 2. 防重复校验
        if (evaluationRepository.existsByOrderId(orderId)) {
            throw new BusinessException("评价失败：该工单已评价，请勿重复提交");
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setRating(request.getRating());
        evaluation.setComment(request.getComment());
        evaluation.setOrder(order);
        evaluation.setAuthor(author);

        return evaluationRepository.save(evaluation);
    }

    // ================= 管理员端功能 =================

    @Override
    public List<RepairOrder> getAllOrders(OrderStatus status, OrderPriority priority) {
        // 实现了 4 种组合筛选逻辑
        if (status != null && priority != null) {
            // 1. 同时筛选状态和优先级
            return orderRepository.findByStatusAndPriorityOrderByCreatedAtDesc(status, priority);
        } else if (status != null) {
            // 2. 只筛选状态
            return orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (priority != null) {
            // 3. 只筛选优先级
            return orderRepository.findByPriorityOrderByCreatedAtDesc(priority);
        } else {
            // 4. 无筛选，查所有
            return orderRepository.findAll();
        }
    }

    @Override
    public RepairOrder assignWorker(Long orderId, AssignOrderRequest request) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("指派失败：工单不存在"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("指派失败：只能指派'待处理'的工单");
        }

        order.setAssignedCompany(request.getAssignedCompany());
        order.setAssignedWorkerName(request.getAssignedWorkerName());
        order.setAssignedWorkerPhone(request.getAssignedWorkerPhone());

        // 指派后自动变为处理中
        order.setStatus(OrderStatus.PROCESSING);

        return orderRepository.save(order);
    }

    @Override
    public RepairOrder updateStatus(Long orderId, OrderStatus status) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("更新失败：工单不存在"));

        if (status == null) {
            throw new BusinessException("更新失败：目标状态不能为空");
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public RepairOrder updatePriority(Long orderId, OrderPriority priority) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("设置失败：工单不存在"));

        if (priority == null) {
            throw new BusinessException("设置失败：优先级不能为空");
        }

        // 可选：限制只有未结束的工单才能改优先级
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELED) {
            throw new BusinessException("设置失败：无法修改已结束工单的优先级");
        }

        order.setPriority(priority);
        return orderRepository.save(order);
    }
    @Override
    public RepairOrder getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("工单不存在"));
    }

    // 记得补上看板统计方法
    @Override
    public com.repair.server.dto.DashboardStats getDashboardStats() {
        long pending = orderRepository.countByStatus(OrderStatus.PENDING);
        long processing = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long completed = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long canceled = orderRepository.countByStatus(OrderStatus.CANCELED);

        return com.repair.server.dto.DashboardStats.builder()
                .pending(pending)
                .processing(processing)
                .completed(completed)
                .canceled(canceled)
                .build();
    }
}