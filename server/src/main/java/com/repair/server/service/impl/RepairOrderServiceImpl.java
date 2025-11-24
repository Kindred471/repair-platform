package com.repair.server.service.impl;

import com.repair.server.dto.AssignOrderRequest;
import com.repair.server.dto.CreateEvaluationRequest;
import com.repair.server.dto.CreateOrderRequest;
import com.repair.server.exception.BusinessException; // 1. 引入我们自定义的异常
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
                .orElseThrow(() -> new BusinessException("提交失败：当前登录用户不存在")); // 使用 BusinessException

        RepairOrder order = new RepairOrder();
        order.setTitle(request.getTitle());
        order.setDescription(request.getDescription());
        order.setAddress(request.getAddress());
        order.setImages(request.getImages());
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
            // 状态校验异常
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

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BusinessException("评价失败：工单尚未完成，无法评价");
        }

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
    public List<RepairOrder> getAllOrders(OrderStatus status) {
        if (status == null) {
            return orderRepository.findAll();
        } else {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status);
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
}