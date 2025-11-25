package com.repair.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private long pending;    // 待处理
    private long processing; // 处理中
    private long completed;  // 已完成
    private long canceled;   // 已取消
}