package com.repair.server.exception;

import com.repair.server.common.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // 告诉 Spring：我是全局处理中心
public class GlobalExceptionHandler {

    // 1. 专门捕获我们刚才定义的 "业务异常"
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }

    // 2. 捕获所有漏网之鱼 (未知的 RuntimeException)
    @ExceptionHandler(RuntimeException.class)
    public Result<?> handleRuntimeException(RuntimeException e) {
        e.printStackTrace(); // 在后台打印错误堆栈，方便排查 Bug
        return Result.error(500, e.getMessage() != null ? e.getMessage() : "服务器内部错误");
    }
}