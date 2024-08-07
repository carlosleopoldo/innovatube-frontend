import { Injectable, signal } from '@angular/core'; // Importamos Signal correctamente
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedInSignal = signal(this.isAuthenticated());
  private userDataSignal = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
  ) {
    // Verifica si el usuario está autenticado al inicializar el servicio
    this.checkAuthStatus();
    const storedUserData = JSON.parse(`${localStorage.getItem('userData')}`);
    if (storedUserData) {
      this.userDataSignal.set(storedUserData);
    }
  }

  wakeUp(): Observable<any> {
    return this.http.get<{ token: string }>(this.apiUrl).pipe(
      tap((response) => {
        if (!response) {
          console.log('API no responde');
        }
      }),
      catchError((error) => {
        return throwError(() => new Error('API no responde'));
      }),
    );
  }

  login(user: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, {
        user: user,
        password: password,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            // Si la solicitud de inicio de sesión es exitosa, almacenamos el token JWT en localStorage
            localStorage.setItem('token', response.token);
            // Extraemos los datos del usuario del token
            const decodedToken = this.jwtHelper.decodeToken(response.token);
            localStorage.setItem('userData', JSON.stringify(decodedToken));
            this.userDataSignal.set(decodedToken);
            // Marcamos al usuario como autenticado
            this.loggedInSignal.set(true);
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }

  register(
    name: string,
    email: string,
    user: string,
    password: string,
  ): Observable<any> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/register`, {
        name: name,
        email: email,
        user: user,
        password: password,
      })
      .pipe(
        tap((response) => {
          if (!response) {
            throw new Error('No se pudo registrar el usuario');
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/forgot-password`, {
        email: email,
      })
      .pipe(
        tap((response) => {
          if (!response) {
            throw new Error('No se pudo solicitar cambio de contraseña');
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }

  verifyToken(token: string): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/verify-token/${token}`)
      .pipe(
        tap((response) => {
          if (!response.data) {
            throw new Error('Token inválido o expirado');
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http
      .post<{
        data: any;
      }>(`${this.apiUrl}/reset-password/${token}`, { password })
      .pipe(
        tap((response) => {
          if (!response.data) {
            throw new Error('No se pudo resetear la contraseña');
          }
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message
            ? error.error.message
            : 'Ha ocurrido un error desconocido';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.userDataSignal.set(null);
    this.loggedInSignal.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    try {
      return !!(token && !this.jwtHelper.isTokenExpired(token));
    } catch (error) {
      this.logout();
      return false;
    }
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.loggedInSignal.set(true);
    } else {
      this.loggedInSignal.set(false);
    }
  }

  getUserData(): any {
    const userData = this.userDataSignal();
    if (userData) {
      return userData;
    }
    return null;
  }
}
