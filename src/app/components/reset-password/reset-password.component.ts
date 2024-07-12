import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { Observer, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    MessagesModule,
    PasswordModule,
    InputTextModule,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();
  loading: boolean = false;
  token: string = '';
  email: string = '';
  tokenValid: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        password_repeat: new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator },
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.verifyToken();
  }

  verifyToken(): void {
    this.authService.verifyToken(this.token).subscribe({
      next: (response) => {
        this.email = response.data.email;
        this.tokenValid = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.tokenValid = false;
        this.messages = [
          {
            severity: 'error',
            detail: error?.message
              ? error.message
              : 'Token inválido o expirado',
          },
        ];
        this.cdr.detectChanges();
      },
      complete: () => {},
    } as Observer<any>);
  }

  submitForm(): void {
    if (this.resetPasswordForm.invalid) {
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

    const { password } = this.resetPasswordForm.value;
    this.authService.resetPassword(this.token, password).subscribe({
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

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }
}
