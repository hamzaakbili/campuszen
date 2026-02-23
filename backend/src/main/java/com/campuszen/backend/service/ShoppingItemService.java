package com.campuszen.backend.service;

import com.campuszen.backend.dto.shopping.ShoppingItemRequest;
import com.campuszen.backend.dto.shopping.ShoppingItemResponse;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.ShoppingItem;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.ShoppingItemRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingItemService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final ResidenceRepository residenceRepository;
    private final UserRepository userRepository;

    public ShoppingItemService(
            ShoppingItemRepository shoppingItemRepository,
            ResidenceRepository residenceRepository,
            UserRepository userRepository
    ) {
        this.shoppingItemRepository = shoppingItemRepository;
        this.residenceRepository = residenceRepository;
        this.userRepository = userRepository;
    }

    public List<ShoppingItemResponse> getShoppingItemsByResidence(Long residenceId) {
        return shoppingItemRepository.findByResidenceIdOrderByPurchasedAscCreatedAtDesc(residenceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ShoppingItemResponse createShoppingItem(ShoppingItemRequest request, Long residenceId, Long userId) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("Shopping item title is required");
        }

        User user = validateUserResidence(userId, residenceId);
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException("Residence not found"));

        ShoppingItem shoppingItem = new ShoppingItem();
        shoppingItem.setResidence(residence);
        shoppingItem.setAddedBy(user);
        shoppingItem.setTitle(request.getTitle().trim());
        shoppingItem.setQuantity(request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1);
        shoppingItem.setPurchased(false);

        ShoppingItem savedItem = shoppingItemRepository.save(shoppingItem);
        return toResponse(savedItem);
    }

    public ShoppingItemResponse togglePurchased(Long shoppingItemId, Long residenceId) {
        ShoppingItem shoppingItem = shoppingItemRepository.findById(shoppingItemId)
                .orElseThrow(() -> new RuntimeException("Shopping item not found"));

        if (shoppingItem.getResidence() == null || !shoppingItem.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("Shopping item does not belong to this residence");
        }

        shoppingItem.setPurchased(!shoppingItem.isPurchased());
        ShoppingItem updatedItem = shoppingItemRepository.save(shoppingItem);
        return toResponse(updatedItem);
    }

    public void deleteShoppingItem(Long shoppingItemId, Long residenceId) {
        ShoppingItem shoppingItem = shoppingItemRepository.findById(shoppingItemId)
                .orElseThrow(() -> new RuntimeException("Shopping item not found"));

        if (shoppingItem.getResidence() == null || !shoppingItem.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("Shopping item does not belong to this residence");
        }

        shoppingItemRepository.delete(shoppingItem);
    }

    private User validateUserResidence(Long userId, Long residenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResidence() == null || !user.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("User does not belong to this residence");
        }

        return user;
    }

    private ShoppingItemResponse toResponse(ShoppingItem shoppingItem) {
        String addedByName = shoppingItem.getAddedBy() != null
                ? shoppingItem.getAddedBy().getFirstName() + " " + shoppingItem.getAddedBy().getLastName()
                : "Inconnu";

        return new ShoppingItemResponse(
                shoppingItem.getId(),
                shoppingItem.getTitle(),
                shoppingItem.getQuantity(),
                shoppingItem.isPurchased(),
                addedByName.trim(),
                shoppingItem.getCreatedAt()
        );
    }
}
