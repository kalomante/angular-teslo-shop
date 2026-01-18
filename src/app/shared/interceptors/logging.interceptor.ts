import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

// * export function loggingInterceptor(
  // El objeto es de tipo unknown para aceptar tipos de peticiones que, a priori, no se sabe el tipo que van a tener
//  * req: HttpRequest<unknown>,
  // next es lo que permite que la petición siga, se puede utilizar para cortar la petición
//  * next: HttpHandlerFn,
// * ): Observable<HttpEvent<unknown>> {
//  * console.log(req.url);
//  * return next(req);
//  *}

// Para mandar el interceptor se debe pasar la función withInterceptors([logginInterceptor, interceptor2, interceptor3 ...]) a la función provideHttpClient dentro de app.config.ts

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
