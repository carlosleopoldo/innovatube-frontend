import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observer, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // Navegar a la página protegida después de iniciar sesión exitosamente
        this.router.navigate(['/videos']);
      },
      error: (error) => {
        // Manejar errores de autenticación
        this.errorMessage = error?.message
          ? error.message
          : 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
      },
      complete: () => {
        // Esta función completa es opcional, pero debes proporcionarla para satisfacer la interfaz Observer<any>
        // Puedes dejarla vacía si no necesitas realizar ninguna acción específica al completar la suscripción
      },
    } as Observer<any>);
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }
}
