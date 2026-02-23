package com.campuszen.backend.controller;

import com.campuszen.backend.dto.shopping.ShoppingItemRequest;
import com.campuszen.backend.dto.shopping.ShoppingItemResponse;
import com.campuszen.backend.service.ShoppingItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shopping-items")
@CrossOrigin(origins = "http://localhost:4200")
public class ShoppingItemController {

    private final ShoppingItemService shoppingItemService;

    public ShoppingItemController(ShoppingItemService shoppingItemService) {
        this.shoppingItemService = shoppingItemService;
    }

    @GetMapping
    public ResponseEntity<List<ShoppingItemResponse>> getShoppingItems(@RequestParam Long residenceId) {
        return ResponseEntity.ok(shoppingItemService.getShoppingItemsByResidence(residenceId));
    }

    @PostMapping
    public ResponseEntity<ShoppingItemResponse> createShoppingItem(
            @RequestBody ShoppingItemRequest request,
            @RequestParam Long residenceId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(shoppingItemService.createShoppingItem(request, residenceId, userId));
    }

    @PatchMapping("/{shoppingItemId}/toggle")
    public ResponseEntity<ShoppingItemResponse> togglePurchased(
            @PathVariable Long shoppingItemId,
            @RequestParam Long residenceId
    ) {
        return ResponseEntity.ok(shoppingItemService.togglePurchased(shoppingItemId, residenceId));
    }

    @DeleteMapping("/{shoppingItemId}")
    public ResponseEntity<Void> deleteShoppingItem(
            @PathVariable Long shoppingItemId,
            @RequestParam Long residenceId
    ) {
        shoppingItemService.deleteShoppingItem(shoppingItemId, residenceId);
        return ResponseEntity.noContent().build();
    }
}
