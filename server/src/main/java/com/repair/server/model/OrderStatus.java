package com.repair.server.model;

public enum OrderStatus {
    PENDING,                // 待处理
    PROCESSING,             // 处理中
    COMPLETED,              // 已完成
    CANCELED,               // 已取消
    CANCELLATION_REQUESTED  // 撤销请求中
}