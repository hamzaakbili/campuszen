import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';
import { ShoppingItem, ShoppingItemRequest, ShoppingService } from '../shopping';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css'
})
export class ShoppingListComponent implements OnInit {
  items: ShoppingItem[] = [];
  residenceId: number | null = null;
  userId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  newItem: ShoppingItemRequest = {
    title: '',
    quantity: 1
  };

  constructor(
    private shoppingService: ShoppingService,
    private residenceService: ResidenceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const residence = this.residenceService.getCurrentResidence();
    this.userId = this.authService.getUserId();

    if (residence) {
      this.residenceId = residence.id;
      this.loadItems();
    }
  }

  get pendingItems(): ShoppingItem[] {
    return this.items.filter((item) => !item.purchased);
  }

  get purchasedItems(): ShoppingItem[] {
    return this.items.filter((item) => item.purchased);
  }

  loadItems(): void {
    if (!this.residenceId) {
      return;
    }

    this.isLoading = true;
    this.shoppingService.getAllItems(this.residenceId).subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la liste de courses';
        this.isLoading = false;
      }
    });
  }

  addItem(): void {
    if (!this.residenceId || !this.userId) {
      this.errorMessage = 'Résidence ou utilisateur non disponible';
      return;
    }
    if (!this.newItem.title.trim()) {
      this.errorMessage = 'Le nom de l’article est obligatoire';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.shoppingService.createItem(this.newItem, this.residenceId, this.userId).subscribe({
      next: () => {
        this.newItem = { title: '', quantity: 1 };
        this.isSubmitting = false;
        this.loadItems();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l’ajout de l’article';
        this.isSubmitting = false;
      }
    });
  }

  toggleItem(item: ShoppingItem): void {
    if (!this.residenceId) {
      return;
    }

    this.shoppingService.togglePurchased(item.id, this.residenceId).subscribe({
      next: () => this.loadItems(),
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour';
      }
    });
  }

  deleteItem(item: ShoppingItem): void {
    if (!this.residenceId) {
      return;
    }
    if (!confirm(`Supprimer "${item.title}" ?`)) {
      return;
    }

    this.shoppingService.deleteItem(item.id, this.residenceId).subscribe({
      next: () => this.loadItems(),
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression';
      }
    });
  }
}
