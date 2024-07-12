import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { Observer, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    MessagesModule,
    PasswordModule,
    InputTextModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = new FormGroup({
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(): void {
    const { user, password } = this.loginForm.value;
    this.authService.login(user, password).subscribe({
      next: () => {
        // Navegar a la página protegida después de iniciar sesión exitosamente
        this.router.navigate(['/videos']);
      },
      error: (error) => {
        this.messages = [
          {
            severity: 'error',
            detail: error?.message
              ? error.message
              : 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
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
