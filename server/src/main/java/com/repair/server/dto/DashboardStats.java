package com.repair.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private long pending;              // 待处理
    private long processing;           // 处理中
    private long completed;            // 已完成（总数）
    private long canceled;             // 已取消
    private long completedThisWeek;    // 本周已完成
    private long p0Urgent;             // P0 紧急工单数
    private int pendingChange;         // 待处理较昨日变化 (+2 表示增加2个)
    private int processingTimeout;     // 处理中即将超时的数量
    private double completionRate;     // 本周完成率 (百分比)
}