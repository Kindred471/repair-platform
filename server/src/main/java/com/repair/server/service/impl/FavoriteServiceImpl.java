package com.repair.server.service.impl;

import com.repair.server.exception.BusinessException;
import com.repair.server.model.Favorite;
import com.repair.server.model.RepairOrder;
import com.repair.server.model.User;
import com.repair.server.repository.FavoriteRepository;
import com.repair.server.repository.RepairOrderRepository;
import com.repair.server.repository.UserRepository;
import com.repair.server.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RepairOrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public void addFavorite(Long orderId, Long adminId) {
        // 1. 检查是否重复收藏 (异常处理核心点)
        Optional<Favorite> existing = favoriteRepository.findByAdminIdAndOrderId(adminId, orderId);
        if (existing.isPresent()) {
            throw new BusinessException("收藏失败：您已经收藏过该工单了");
        }

        // 2. 检查工单是否存在
        RepairOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("收藏失败：工单不存在"));

        // 3. 检查管理员是否存在
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new BusinessException("收藏失败：管理员账户异常"));

        // 4. 保存
        Favorite favorite = new Favorite();
        favorite.setOrder(order);
        favorite.setAdmin(admin);
        favoriteRepository.save(favorite);
    }

    @Override
    public void removeFavorite(Long orderId, Long adminId) {
        // 1. 查找收藏记录
        Favorite favorite = favoriteRepository.findByAdminIdAndOrderId(adminId, orderId)
                .orElseThrow(() -> new BusinessException("移除失败：您未收藏该工单，无法取消"));

        // 2. 删除
        favoriteRepository.delete(favorite);
    }

    @Override
    public List<Favorite> getMyFavorites(Long adminId) {
        return favoriteRepository.findByAdminIdOrderByCreatedAtDesc(adminId);
    }
}