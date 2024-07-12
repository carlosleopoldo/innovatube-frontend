import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { Observer, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
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
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();
  loading: boolean = false;
  recaptchaToken: string | null = null;
  siteKey: string = environment.recaptchaKey;

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
        recaptcha: new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator },
    );
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

    this.loading = true;

    const { name, email, user, password } = this.registerForm.value;
    this.authService.register(name, email, user, password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.loading = false;
        this.cdr.detectChanges();
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
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {},
    } as Observer<any>);
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;
    this.registerForm.get('recaptcha')?.setValue(token);
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }
}
