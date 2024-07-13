import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit, AfterViewInit {
  menuItems: MenuItem[] | undefined;
  userData: any;
  isInputFocused: boolean = false;
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
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
}
