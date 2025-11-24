package com.repair.server.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final int code;

    // 默认错误码 500
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    // 自定义错误码
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}