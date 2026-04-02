package com.repair.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeeklyTrend {
    private String date;       // 日期 YYYY-MM-DD
    private String dayOfWeek;  // 星期名称 (周一~周日)
    private long pending;      // 当天待处理数
    private long completed;    // 当天完成数
}
