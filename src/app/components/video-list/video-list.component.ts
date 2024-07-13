import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MenuItem, Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { fromEvent, Observer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, MenuModule, DialogModule, ButtonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit, AfterViewInit {
  menuItems: MenuItem[] | undefined;
  userData: any;
  isInputFocused: boolean = false;
  loading: boolean = false;
  searchResults: any[] = [];
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;
  messages: Message[] = [];
  displayPlayer: boolean = false;
  videoUrl: string = '';
  videoTitle: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private youtubeService: YoutubeService,
    public sanitizer: DomSanitizer,
  ) {
    this.userData = authService.getUserData();
  }

  ngOnInit() {
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

  ngAfterViewInit() {
    this.focusInput();
    this.cdr.detectChanges();
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: Event) => (event.target as HTMLInputElement).value),
        distinctUntilChanged(),
        filter((value: string) => value.length > 3),
      )
      .subscribe((value) => {
        this.searchVideos(value);
      });
  }

  public focusInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  public onInputFocus() {
    this.isInputFocused = true;
  }

  public onInputBlur() {
    this.isInputFocused = false;
  }

  public signout() {
    this.authService.logout();
  }

  public searchVideos(query: string) {
    this.loading = true;
    this.cdr.detectChanges();

    this.youtubeService.searchVideos(query).subscribe({
      next: (data) => {
        this.searchResults = data;
        console.log(this.searchResults);
        this.loading = false;
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
        this.cdr.detectChanges();
      },
      complete: () => {},
    } as Observer<any>);
  }

  markAsFavorite(video: any) {
    console.log('Video marcado como favorito:', video);
  }

  openVideoPlayer(video: any) {
    this.videoUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
    this.videoTitle = video.title;
    this.displayPlayer = true;
  }
}
