import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResidenceEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  eventDateTime: string;
  createdByName: string;
  createdAt: string;
}

export interface ResidenceEventRequest {
  title: string;
  description: string;
  location: string;
  eventDateTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  getAllEvents(residenceId: number): Observable<ResidenceEvent[]> {
    return this.http.get<ResidenceEvent[]>(`${this.apiUrl}?residenceId=${residenceId}`);
  }

  createEvent(event: ResidenceEventRequest, residenceId: number, userId: number): Observable<ResidenceEvent> {
    return this.http.post<ResidenceEvent>(
      `${this.apiUrl}?residenceId=${residenceId}&userId=${userId}`,
      event
    );
  }

  updateEvent(eventId: number, event: ResidenceEventRequest, residenceId: number): Observable<ResidenceEvent> {
    return this.http.put<ResidenceEvent>(
      `${this.apiUrl}/${eventId}?residenceId=${residenceId}`,
      event
    );
  }

  deleteEvent(eventId: number, residenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}?residenceId=${residenceId}`);
  }
}
