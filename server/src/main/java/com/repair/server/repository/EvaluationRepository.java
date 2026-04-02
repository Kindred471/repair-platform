package com.repair.server.repository;

import com.repair.server.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    // 根据工单ID查找评价 (用于确认这单是否评价过)
    Optional<Evaluation> findByOrderId(Long orderId);

    // 检查是否已存在
    boolean existsByOrderId(Long orderId);
}
