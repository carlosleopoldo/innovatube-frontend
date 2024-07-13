import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchVideos(query: string): Observable<any> {
    const params = {
      q: query,
    };

    return this.http
      .get<any>(`${this.apiUrl}/search`, { params })
      .pipe(
        tap((response) => {
          if (!response) {
            throw new Error('No se buscó en YouTube');
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
