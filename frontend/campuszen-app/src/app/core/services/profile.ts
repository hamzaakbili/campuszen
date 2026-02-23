import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  cursus: string;
  bio: string;
  avatarColor: string;
  residenceId: number | null;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  cursus: string;
  bio: string;
  avatarColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  private currentProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}/profile`).pipe(
      tap((profile) => this.currentProfileSubject.next(profile))
    );
  }

  updateProfile(userId: number, payload: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}/profile`, payload).pipe(
      tap((profile) => this.currentProfileSubject.next(profile))
    );
  }
}
