import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { environment } from '../environments/environment';
import { VideoType } from '../types/video.type';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFavoriteVideos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/favorite-videos`).pipe(
      tap((response) => {
        if (!response) {
          throw new Error('No se encontraron favoritos');
        }
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message
          ? error.error.message
          : 'Ha ocurrido un error desconocido';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  markAsFavorite(video: VideoType): Observable<any> {
    const params = {
      video: video,
    };

    return this.http.post<any>(`${this.apiUrl}/mark-favorite`, { params }).pipe(
      tap((response) => {
        if (!response) {
          throw new Error('No se marcó como favorito');
        }
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message
          ? error.error.message
          : 'Ha ocurrido un error desconocido';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  unmarkAsFavorite(video: VideoType): Observable<any> {
    const params = {
      video: video,
    };

    return this.http
      .post<any>(`${this.apiUrl}/unmark-favorite`, { params })
      .pipe(
        tap((response) => {
          if (!response) {
            throw new Error('No se desmarcó como favorito');
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }
}
