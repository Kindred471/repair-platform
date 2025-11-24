package com.repair.server.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "repair_orders")
@Data
public class RepairOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 基础信息 ---
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address;

    // --- 图片列表 ---
    @ElementCollection
    @CollectionTable(name = "repair_order_images", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "image_url")
    private List<String> images;

    // --- 状态管理 ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private OrderPriority priority;

    private String cancellationReason;

    // --- 维修分配 ---
    private String assignedCompany;
    private String assignedWorkerName;
    private String assignedWorkerPhone;

    // --- 关联关系 ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User author;

    // --- 时间记录 ---
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}