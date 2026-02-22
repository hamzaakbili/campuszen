import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Residence {
  id: number;
  name: string;
  address: string;
  code: string;
  memberCount: number;
}

export interface CreateResidenceRequest {
  name: string;
  address: string;
}

export interface JoinResidenceRequest {
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/residences`;
  
  private currentResidenceSubject = new BehaviorSubject<Residence | null>(null);
  public currentResidence$ = this.currentResidenceSubject.asObservable();

  constructor() {
    // Charger la résidence du localStorage au démarrage
    const savedResidence = localStorage.getItem('currentResidence');
    if (savedResidence) {
      this.currentResidenceSubject.next(JSON.parse(savedResidence));
    }
  }

  createResidence(data: CreateResidenceRequest, userId: number): Observable<Residence> {
    return this.http.post<Residence>(`${this.apiUrl}/create?userId=${userId}`, data)
      .pipe(
        tap(residence => this.saveResidence(residence))
      );
  }

  joinResidence(data: JoinResidenceRequest, userId: number): Observable<Residence> {
    return this.http.post<Residence>(`${this.apiUrl}/join?userId=${userId}`, data)
      .pipe(
        tap(residence => this.saveResidence(residence))
      );
  }

  getMyResidence(userId: number): Observable<Residence> {
    return this.http.get<Residence>(`${this.apiUrl}/my-residence?userId=${userId}`)
      .pipe(
        tap(residence => this.saveResidence(residence))
      );
  }

  private saveResidence(residence: Residence): void {
    localStorage.setItem('currentResidence', JSON.stringify(residence));
    this.currentResidenceSubject.next(residence);
  }

  hasResidence(): boolean {
    return !!localStorage.getItem('currentResidence');
  }

  getCurrentResidence(): Residence | null {
    const residence = localStorage.getItem('currentResidence');
    return residence ? JSON.parse(residence) : null;
  }

  clearResidence(): void {
    localStorage.removeItem('currentResidence');
    this.currentResidenceSubject.next(null);
  }
}