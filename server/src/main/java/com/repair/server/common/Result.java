package com.repair.server.common;

import lombok.Data;

@Data
public class Result<T> {
    private int code;       // 200 表示成功，其他表示失败
    private String message; // 提示信息
    private T data;         // 实际返回的数据

    // 快捷方法：成功时调用
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = 200;
        r.message = "success";
        r.data = data;
        return r;
    }

    // 快捷方法：失败时调用
    public static <T> Result<T> error(int code, String msg) {
        Result<T> r = new Result<>();
        r.code = code;
        r.message = msg;
        return r;
    }
}