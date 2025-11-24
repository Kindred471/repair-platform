package com.repair.server.service;

import com.repair.server.model.Favorite;
import java.util.List;

public interface FavoriteService {

    // 添加收藏
    void addFavorite(Long orderId, Long adminId);

    // 移除收藏
    void removeFavorite(Long orderId, Long adminId);

    // 获取收藏列表
    List<Favorite> getMyFavorites(Long adminId);
}