import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnDestroy, OnInit {
  forgotPasswordForm: FormGroup;
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
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      recaptcha: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.authService.wakeUp().subscribe();
  }

  submitForm(): void {
    if (this.forgotPasswordForm.invalid) {
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
    this.messages = [];

    const { email } = this.forgotPasswordForm.value;
    this.authService.forgotPassword(email).subscribe({
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
              : 'Error. Por favor, inténtalo de nuevo.',
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
    this.forgotPasswordForm.get('recaptcha')?.setValue(token);
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }
}
