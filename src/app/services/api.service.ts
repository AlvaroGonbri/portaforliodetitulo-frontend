import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface users {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface groups {
  "id": number,
  "name": string
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  urlUsers = "http://127.0.0.1:8000/users/";
  urlGroups = "http://127.0.0.1:8000/groups/";
  // Aquí coloca tu API key
  private apiKey: string = 'ac5288cad4f1df04bc4d56fe6af374efb057ec4b';

  constructor(private http: HttpClient) { }

  getusers(): Observable<users[]> {
    // Configura los headers con la API key
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.apiKey}`
    });
    return this.http.get<users[]>(this.urlUsers, { headers });
  }

  getgroups(): Observable<groups[]> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.apiKey}`
    });

    return this.http.get<groups[]>(this.urlGroups, { headers });
  }
}
