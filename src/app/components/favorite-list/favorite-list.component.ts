import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Observer } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { VideosService } from '../../services/videos.service';
import { VideoType } from '../../types/video.type';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuModule, ButtonModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.scss',
})
export class FavoriteListComponent implements OnInit {
  menuItems: MenuItem[] | undefined;
  userData: any;
  loading: boolean = false;
  videos: VideoType[] = [];
  messages: Message[] = [];
  displayPlayer: boolean = false;
  videoUrl: string = '';
  videoTitle: string = '';
  filteredVideos: any[] = [];
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private videosService: VideosService,
    private cdr: ChangeDetectorRef,
  ) {
    this.userData = authService.getUserData();
  }

  ngOnInit(): void {
    this.fetchFavoriteVideos();

    this.menuItems = [
      {
        label: this.userData.name,
        items: [
          {
            label: 'Favoritos',
            icon: 'pi pi-heart',
            command: () => {
              this.router.navigate(['/favorites']);
            },
          },
        ],
      },
      {
        label: 'Sesión',
        items: [
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
              this.signout();
            },
          },
        ],
      },
    ];
  }

  fetchFavoriteVideos(): void {
    this.videosService.getFavoriteVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.filteredVideos = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.messages = [
          {
            severity: 'error',
            detail: error?.message
              ? error.message
              : 'Error. Por favor, inténtalo de nuevo.',
          },
        ];
        this.loading = false;
        this.fetchFavoriteVideos();
        this.cdr.detectChanges();
      },
      complete: () => {},
    } as Observer<any>);
  }

  applyFilter(): void {
    const lowerCaseQuery = this.searchQuery.toLowerCase().trim();

    this.filteredVideos = this.videos.filter((video) =>
      video.title.toLowerCase().includes(lowerCaseQuery),
    );
  }

  clearFilter(): void {
    this.searchQuery = '';
    this.filteredVideos = [...this.videos];
  }

  unmarkAsFavorite(video: VideoType) {
    this.videosService.unmarkAsFavorite(video).subscribe({
      next: (data) => {
        video.isFavorite = false;
        this.fetchFavoriteVideos();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.messages = [
          {
            severity: 'error',
            detail: error?.message
              ? error.message
              : 'Error. Por favor, inténtalo de nuevo.',
          },
        ];
        this.loading = false;
        this.fetchFavoriteVideos();
        this.cdr.detectChanges();
      },
      complete: () => {},
    } as Observer<any>);
  }

  openVideoPlayer(video: any) {
    this.videoUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
    this.videoTitle = video.title;
    this.displayPlayer = true;
  }

  public signout() {
    this.authService.logout();
  }
}
