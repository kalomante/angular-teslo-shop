import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = "checking" | "authenticated" | "not-authenticated";

const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  // token lo inicializamos al valor del localStorage para que no devuelva undefined en la parte del interceptor
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

// Inmediatamente después de montar el servicio, se llama al método checkStatus para comprobar si el usuario está loggeado
  checkStatusResource = rxResource({
    loader: ()=>(this.checkStatus())
  });

  authStatus = computed<AuthStatus>(()=> {
    if(this._authStatus() === "checking"){
      return "checking";
    }


    if(this._user()){
      return "authenticated";
    }

    return "not-authenticated";
  })

  errorExists = signal<boolean>(false);


  user = computed<User | null>(()=>this._user());

  token = computed(()=> this._token());

  login(email: string, password: string): Observable<boolean>{
    // Cuando se hace una petición http estamos esperando un mensaje de éxito
    return this.http.post<AuthResponse>(`${ baseUrl }/auth/login`,{
      email: email,
      password: password
    }).pipe(
      map(resp=>this.handleAuthSuccess(resp)),
      catchError((error: any)=> this.handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean>{

  const token = localStorage.getItem('token');

  if(!token) return of(false);

  return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`,
    {
      // headers: {
      //   Authorization: `Bearer ${ token }`
      // }
    }
  )
  .pipe(
    map(resp=>this.handleAuthSuccess(resp)),
      catchError((error: any)=> this.handleAuthError(error))
  )

  }

  logout(){
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem('token');
  }

  register(email: string, password: string, fullName: string){
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName
    })
    .pipe(
      map(resp=>{ return this.handleAuthSuccess(resp)}),
      catchError((error: any,)=>{
        return this.handleAuthError(error, email)}),
    )
  }

  private handleAuthSuccess(request: AuthResponse){
    this._authStatus.set("authenticated");
    this._user.set(request.user);
    this._token.set(request.token);

    localStorage.setItem('token', request.token);

    return true;
  }

  private handleAuthError(error: any, email?: string){
    this.logout();
    if(error.error.message === `Key (email)=(${email}) already exists.`){
      this.errorExists.set(true);
    }
    return of(false);
  }
}
