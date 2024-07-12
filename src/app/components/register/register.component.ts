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
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
  registerForm: FormGroup;
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        user: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_repeat: new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const passwordRepeat = form.get('password_repeat')?.value;
    if (password !== passwordRepeat) {
      form.get('password_repeat')?.setErrors({ mismatch: true });
    } else {
      form.get('password_repeat')?.setErrors(null);
    }
    return null;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.messages = [
        {
          severity: 'error',
          detail: 'Por favor, completa todos los campos correctamente.',
        },
      ];
      this.cdr.detectChanges();
      return;
    }

    const { name, email, user, password } = this.registerForm.value;

    this.authService.register(name, email, user, password).subscribe({
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
