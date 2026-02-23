import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';
import { EventService, ResidenceEvent, ResidenceEventRequest } from '../event';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsListComponent implements OnInit {
  events: ResidenceEvent[] = [];
  residenceId: number | null = null;
  userId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  newEvent: ResidenceEventRequest = {
    title: '',
    description: '',
    location: '',
    eventDateTime: ''
  };

  constructor(
    private eventService: EventService,
    private residenceService: ResidenceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const residence = this.residenceService.getCurrentResidence();
    this.userId = this.authService.getUserId();

    if (residence) {
      this.residenceId = residence.id;
      this.loadEvents();
    }
  }

  get upcomingEvents(): ResidenceEvent[] {
    const now = new Date().getTime();
    return this.events.filter((event) => new Date(event.eventDateTime).getTime() >= now);
  }

  get pastEvents(): ResidenceEvent[] {
    const now = new Date().getTime();
    return this.events.filter((event) => new Date(event.eventDateTime).getTime() < now);
  }

  loadEvents(): void {
    if (!this.residenceId) {
      return;
    }

    this.isLoading = true;
    this.eventService.getAllEvents(this.residenceId).subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les événements';
        this.isLoading = false;
      }
    });
  }

  addEvent(): void {
    if (!this.residenceId || !this.userId) {
      this.errorMessage = 'Résidence ou utilisateur non disponible';
      return;
    }
    if (!this.newEvent.title.trim() || !this.newEvent.eventDateTime) {
      this.errorMessage = 'Le titre et la date sont obligatoires';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.eventService.createEvent(this.newEvent, this.residenceId, this.userId).subscribe({
      next: () => {
        this.newEvent = {
          title: '',
          description: '',
          location: '',
          eventDateTime: ''
        };
        this.isSubmitting = false;
        this.loadEvents();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de l’événement';
        this.isSubmitting = false;
      }
    });
  }

  deleteEvent(event: ResidenceEvent): void {
    if (!this.residenceId) {
      return;
    }
    if (!confirm(`Supprimer l'événement "${event.title}" ?`)) {
      return;
    }

    this.eventService.deleteEvent(event.id, this.residenceId).subscribe({
      next: () => this.loadEvents(),
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression de l’événement';
      }
    });
  }
}
