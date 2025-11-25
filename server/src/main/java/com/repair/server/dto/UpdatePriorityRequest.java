package com.repair.server.dto;

import com.repair.server.model.OrderPriority;
import lombok.Data;

@Data
public class UpdatePriorityRequest {
    private OrderPriority priority; // P0, P1, P2
}