package com.campuszen.backend.repository;

import com.campuszen.backend.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByResidenceIdOrderByPurchasedAscCreatedAtDesc(Long residenceId);
}
