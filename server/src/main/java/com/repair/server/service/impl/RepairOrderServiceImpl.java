package com.repair.server.service.impl;

import com.repair.server.dto.*;
import com.repair.server.exception.BusinessException;
import com.repair.server.model.*;
import com.repair.server.repository.EvaluationRepository;
import com.repair.server.repository.RepairOrderRepository;
import com.repair.server.repository.UserRepository;
import com.repair.server.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepairOrderServiceImpl implements RepairOrderService {

    private final RepairOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EvaluationRepository evaluationRepository;

    // ===================== 报修类型关键词映射 =====================
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new LinkedHashMap<>();
    static {
        CATEGORY_KEYWORDS.put("水电", Arrays.asList("水", "电", "管道", "电路", "漏水", "停电", "水管", "电线", "水龙头", "插座", "开关", "跳闸"));
        CATEGORY_KEYWORDS.put("门窗", Arrays.asList("门", "窗", "锁", "玻璃", "纱窗", "门锁", "门把"));
        CATEGORY_KEYWORDS.put("公共设施", Arrays.asList("电梯", "楼道", "公共", "路灯", "绿化", "车库", "消防", "监控", "大门", "围墙"));
    }

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
            return orderRepository.findByStatusAndPriorityOrderByCreatedAtDesc(status, priority);
        } else if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (priority != null) {
            return orderRepository.findByPriorityOrderByCreatedAtDesc(priority);
        } else {
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

        // 限制只有未结束的工单才能改优先级
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

    // ================= 新增：撤销请求功能 =================

    @Override
    public RepairOrder requestCancellation(Long orderId, String reason) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("操作失败：工单不存在"));

        // 只有 PENDING 和 PROCESSING 状态的工单可以发起撤销请求
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PROCESSING) {
            throw new BusinessException("操作失败：只能对'待处理'或'处理中'的工单发起撤销请求");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new BusinessException("操作失败：撤销原因不能为空");
        }

        // 保存撤销前的状态，用于业主拒绝时恢复
        order.setPreviousStatus(order.getStatus());
        order.setCancellationReason(reason);
        order.setStatus(OrderStatus.CANCELLATION_REQUESTED);

        return orderRepository.save(order);
    }

    @Override
    public RepairOrder respondToCancellation(Long orderId, boolean agree, Long userId) {
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("操作失败：工单不存在"));

        // 校验：只有撤销请求中的工单才能响应
        if (order.getStatus() != OrderStatus.CANCELLATION_REQUESTED) {
            throw new BusinessException("操作失败：该工单当前没有待处理的撤销请求");
        }

        // 校验：只有工单的提交者才能响应
        if (!order.getAuthor().getId().equals(userId)) {
            throw new BusinessException("操作失败：只有工单的提交者才能响应撤销请求");
        }

        if (agree) {
            // 同意 -> 工单变为已取消
            order.setStatus(OrderStatus.CANCELED);
        } else {
            // 拒绝 -> 恢复到撤销请求之前的状态
            OrderStatus restoreStatus = order.getPreviousStatus();
            if (restoreStatus == null) {
                restoreStatus = OrderStatus.PENDING; // 安全兜底
            }
            order.setStatus(restoreStatus);
            order.setCancellationReason(null); // 清除撤销原因
        }

        order.setPreviousStatus(null); // 清除临时记录

        return orderRepository.save(order);
    }

    // ================= 新增：Dashboard 扩展统计 =================

    @Override
    public DashboardStats getDashboardStats() {
        long pending = orderRepository.countByStatus(OrderStatus.PENDING);
        long processing = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long completed = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long canceled = orderRepository.countByStatus(OrderStatus.CANCELED);

        // --- 新增统计 ---

        // 本周的时间范围 (周一 00:00:00 ~ 周日 23:59:59)
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        LocalDateTime weekStartTime = weekStart.atStartOfDay();
        LocalDateTime weekEndTime = weekEnd.atTime(LocalTime.MAX);

        // 本周已完成数：本周内 updatedAt 在范围内且状态为 COMPLETED
        long completedThisWeek = orderRepository.countByStatusAndUpdatedAtBetween(
                OrderStatus.COMPLETED, weekStartTime, weekEndTime);

        // P0 紧急工单数 (未结束的)
        long p0Urgent = orderRepository.countByPriority(OrderPriority.P0);

        // 待处理较昨日变化
        LocalDate yesterday = today.minusDays(1);
        LocalDateTime yesterdayStart = yesterday.atStartOfDay();
        LocalDateTime yesterdayEnd = yesterday.atTime(LocalTime.MAX);
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

        long todayNewPending = orderRepository.countByStatusAndCreatedAtBetween(
                OrderStatus.PENDING, todayStart, todayEnd);
        long yesterdayNewPending = orderRepository.countByStatusAndCreatedAtBetween(
                OrderStatus.PENDING, yesterdayStart, yesterdayEnd);
        int pendingChange = (int) (todayNewPending - yesterdayNewPending);

        // 处理中即将超时：超过 7 天仍在处理中
        LocalDateTime timeoutThreshold = LocalDateTime.now().minusDays(7);
        int processingTimeout = (int) orderRepository.countByStatusAndCreatedAtBefore(
                OrderStatus.PROCESSING, timeoutThreshold);

        // 本周完成率 = 本周完成数 / (本周完成数 + 当前待处理数 + 当前处理中) * 100
        long totalActive = completedThisWeek + pending + processing;
        double completionRate = totalActive > 0 ? (completedThisWeek * 100.0 / totalActive) : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0; // 保留一位小数

        return DashboardStats.builder()
                .pending(pending)
                .processing(processing)
                .completed(completed)
                .canceled(canceled)
                .completedThisWeek(completedThisWeek)
                .p0Urgent(p0Urgent)
                .pendingChange(pendingChange)
                .processingTimeout(processingTimeout)
                .completionRate(completionRate)
                .build();
    }

    // ================= 新增：本周趋势数据 =================

    @Override
    public List<WeeklyTrend> getWeeklyTrends() {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        String[] dayNames = {"周一", "周二", "周三", "周四", "周五", "周六", "周日"};
        List<WeeklyTrend> trends = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.atTime(LocalTime.MAX);

            // 当天新创建的 PENDING 工单数
            long pendingCount = orderRepository.countByStatusAndCreatedAtBetween(
                    OrderStatus.PENDING, dayStart, dayEnd);

            // 当天完成的工单数 (updatedAt 在当天 且 状态为 COMPLETED)
            long completedCount = orderRepository.countByStatusAndUpdatedAtBetween(
                    OrderStatus.COMPLETED, dayStart, dayEnd);

            trends.add(WeeklyTrend.builder()
                    .date(date.toString())
                    .dayOfWeek(dayNames[i])
                    .pending(pendingCount)
                    .completed(completedCount)
                    .build());
        }

        return trends;
    }

    // ================= 新增：报修类型占比统计 =================

    @Override
    public List<CategoryStat> getCategoryStats() {
        List<RepairOrder> allOrders = orderRepository.findAll();
        long total = allOrders.size();

        if (total == 0) {
            return Collections.emptyList();
        }

        // 按类型统计
        Map<String, Long> countMap = new LinkedHashMap<>();
        countMap.put("水电", 0L);
        countMap.put("门窗", 0L);
        countMap.put("公共设施", 0L);
        countMap.put("其他", 0L);

        for (RepairOrder order : allOrders) {
            String text = (order.getTitle() != null ? order.getTitle() : "")
                    + (order.getDescription() != null ? order.getDescription() : "");
            String matched = matchCategory(text);
            countMap.merge(matched, 1L, Long::sum);
        }

        // 转换为 DTO
        List<CategoryStat> stats = new ArrayList<>();
        for (Map.Entry<String, Long> entry : countMap.entrySet()) {
            long count = entry.getValue();
            if (count > 0) {
                double percentage = Math.round(count * 1000.0 / total) / 10.0; // 保留一位小数
                stats.add(CategoryStat.builder()
                        .category(entry.getKey())
                        .count(count)
                        .percentage(percentage)
                        .build());
            }
        }

        return stats;
    }

    /**
     * 根据关键词匹配报修类型
     */
    private String matchCategory(String text) {
        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }
        return "其他";
    }

    // ================= 新增：本周重点关注工单 =================

    @Override
    public List<RepairOrder> getWeeklyFocusOrders(OrderPriority priority, int limit) {
        List<OrderPriority> priorities;
        if (priority != null) {
            priorities = Collections.singletonList(priority);
        } else {
            // 默认返回 P0 和 P1
            priorities = Arrays.asList(OrderPriority.P0, OrderPriority.P1);
        }

        List<RepairOrder> orders = orderRepository.findWeeklyFocusOrders(priorities);

        // 限制返回数量
        if (orders.size() > limit) {
            return orders.subList(0, limit);
        }
        return orders;
    }
}