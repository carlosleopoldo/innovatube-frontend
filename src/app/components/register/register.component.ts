import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { Observer, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    MessagesModule,
    PasswordModule,
    InputTextModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  name: string = '';
  email: string = '';
  user: string = '';
  password: string = '';
  password_repeat: string = '';
  errorMessage: string = '';
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  register(): void {
    this.authService
      .register(this.name, this.email, this.user, this.password)
      .subscribe({
        next: () => {
          // Navegar a la página protegida después de iniciar sesión exitosamente
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.messages = [
            {
              severity: 'error',
              detail: error?.message
                ? error.message
                : 'Error al crear usuario. Por favor, inténtalo de nuevo.',
            },
          ];
          this.cdr.detectChanges();
        },
        complete: () => {},
      } as Observer<any>);
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }
}
