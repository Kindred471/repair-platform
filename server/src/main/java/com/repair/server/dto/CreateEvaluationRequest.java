package com.repair.server.dto;

import lombok.Data;

@Data
public class CreateEvaluationRequest {
    private Integer rating; // 1-5
    private String comment; // 评价内容
}