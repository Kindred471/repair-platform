package com.repair.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    // 这些字段对应前端表单填写的项
    private String title;
    private String description;
    private String address;
    private List<String> images; // 图片链接列表
}