package com.repair.server.dto;

import lombok.Data;

@Data
public class CancellationRequest {
    private String reason; // 管理员填写的撤销原因
}
