import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.scss',
})
export class FavoriteListComponent implements OnInit {
  menuItems: MenuItem[] | undefined;
  userData: any;

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

  public signout() {
    this.authService.logout();
  }
}
