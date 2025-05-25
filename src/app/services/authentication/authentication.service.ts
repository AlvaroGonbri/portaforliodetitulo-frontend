
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
providedIn: 'root'
})
export class AuthenticationService {
private apiUrl = 'http://127.0.0.1:8000/api/token/';

constructor(private http: HttpClient) {}

login(username: string, password: string) {
return this.http.post<any>(this.apiUrl, { username, password })
.pipe(tap(res => {
localStorage.setItem('access_token', res.access);
localStorage.setItem('refresh_token', res.refresh);

}));
}

getUserProfile() {
return this.http.get<any>('http://127.0.0.1:8000/users/me/');
}

getUserRoles(): string[] {
const roles = localStorage.getItem('roles');
return roles ? JSON.parse(roles) : [];
}

refreshToken(refreshToken: string) {
return this.http.post<any>('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
}

logout() {
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('roles');
}

isAuthenticated(): boolean {
return !!localStorage.getItem('access_token');
}
}