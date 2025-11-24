package com.repair.server.dto;

import com.repair.server.model.OrderStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private OrderStatus status; // 目标状态 (如 COMPLETED)
}