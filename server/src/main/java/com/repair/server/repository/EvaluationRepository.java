package com.repair.server.repository;

import com.repair.server.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.repair.server.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    // 根据工单ID查找评价 (用于确认这单是否评价过)
    Optional<Evaluation> findByOrderId(Long orderId);
    // === 新增：检查是否已存在 ===
    // Spring Data JPA 会自动生成 SQL: select count(*) > 0 from evaluations where order_id = ?
    boolean existsByOrderId(Long orderId);
}
