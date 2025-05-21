import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://127.0.0.1:8000/api-token-auth/'

  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl, { username, password })
      .pipe(tap(res => {
        // Guarda el token en localStorage
        localStorage.setItem('access_token', res.token); // Ajusta según la respuesta de tu backend
      }));
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

