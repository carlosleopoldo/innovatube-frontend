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

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
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

  getYouTubeVideoId(url: string): string | null {
    // Ejemplos de URLs válidas de YouTube:
    // - https://www.youtube.com/watch?v=ma67yOdMQfs
    // - https://youtu.be/ma67yOdMQfs
    // - https://www.youtube.com/embed/ma67yOdMQfs

    // Expresión regular para extraer el ID del video de diferentes tipos de URL de YouTube
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Intentar hacer match de la URL con la expresión regular
    const match = url.match(regExp);

    if (match) {
      return match[1]; // El ID del video está en el primer grupo capturado por la expresión regular
    } else {
      return null; // Si no se encontró un ID válido, devolver null
    }
  }
}
