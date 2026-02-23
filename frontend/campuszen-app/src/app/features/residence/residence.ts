import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    const residence = this.getCurrentResidence();
    if (!residence) {
      localStorage.removeItem('currentResidence');
    }
    this.currentResidenceSubject.next(residence);
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

  getMyResidence(userId: number): Observable<Residence | null> {
    return this.http.get<Residence>(`${this.apiUrl}/my-residence?userId=${userId}`)
      .pipe(
        tap((residence) => {
          if (residence) {
            this.saveResidence(residence);
          } else {
            this.clearResidence();
          }
        }),
        catchError(() => {
          this.clearResidence();
          return of(null);
        })
      );
  }

  private saveResidence(residence: Residence): void {
    localStorage.setItem('currentResidence', JSON.stringify(residence));
    this.currentResidenceSubject.next(residence);
  }

  hasResidence(): boolean {
    return this.getCurrentResidence() !== null;
  }

  getCurrentResidence(): Residence | null {
    const raw = localStorage.getItem('currentResidence');
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.id !== 'number') {
        return null;
      }
      return parsed as Residence;
    } catch {
      return null;
    }
  }

  clearResidence(): void {
    localStorage.removeItem('currentResidence');
    this.currentResidenceSubject.next(null);
  }
}
