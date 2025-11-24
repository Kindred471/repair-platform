package com.repair.server.dto;

import lombok.Data;

@Data
public class AssignOrderRequest {
    private String assignedCompany;     // 维修公司
    private String assignedWorkerName;  // 维修工姓名
    private String assignedWorkerPhone; // 维修工电话
}