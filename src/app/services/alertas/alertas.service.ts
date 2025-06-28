import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private baseUrl = 'http://localhost:8000/rest'; // Ajusta según tu API

  constructor(private http: HttpClient) { }

  getAlertasVencidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alertas-vencidas/`);
  }
}
