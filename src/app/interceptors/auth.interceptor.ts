import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Lista de prefijos de endpoints que no requieren autenticación
  const nonAuthEndpoints = [
    '/login',
    '/register',
  ];

  // Función para verificar si la URL de la solicitud coincide con algún prefijo
  const isNonAuthEndpoint = nonAuthEndpoints.some((prefix) =>
    request.url.includes(prefix)
  );

  // Si la URL coincide con algún prefijo, pasar la solicitud sin modificar
  if (isNonAuthEndpoint) {
    return next(request);
  }

  // De lo contrario, agregar el token de autorización si está presente
  const token = localStorage.getItem('token');
  let authReq = request;

  if (token) {
    authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq);
};
