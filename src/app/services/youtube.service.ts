import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = environment.youtubeApiKey;
  private apiUrl = environment.youtubeApiKey;

  constructor(private http: HttpClient) {}

  searchVideos(query: string): Observable<any> {
    const params = {
      part: 'snippet',
      maxResults: '10',
      q: query,
      key: this.apiKey,
    };

    return this.http.get<any>(this.apiUrl, { params });
  }
}
