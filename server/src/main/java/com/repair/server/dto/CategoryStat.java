package com.repair.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryStat {
    private String category;    // 报修类型 (水电、门窗、公共设施、其他)
    private long count;         // 数量
    private double percentage;  // 占比 (百分比)
}
