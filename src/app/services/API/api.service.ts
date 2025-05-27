import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { users } from 'src/app/models/user.interface';
import { groups } from 'src/app/models/user.interface';
import { userProfile } from 'src/app/models/user.interface';
import { Producto } from 'src/app/models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class APIService {

  urlUsers = "http://127.0.0.1:8000/users/";
  urlGroups = "http://127.0.0.1:8000/groups/";
  urlInventario = "http://127.0.0.1:8000/rest/productos/";

 
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

  crearUsuario(usuario: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.post(this.urlUsers, usuario, { headers });
}

eliminarUsuario(id: number): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.delete(`${this.urlUsers}${id}/`, { headers });
}

editarUsuario(id: number, usuario: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.patch(`${this.urlUsers}${id}/`, usuario, { headers });
}

// Listar productos
getProductos(): Observable<Producto[]> {
  return this.http.get<Producto[]>(`${this.urlInventario}`);
}

// Crear producto
crearProducto(producto: Producto): Observable<Producto> {
  return this.http.post<Producto>(`${this.urlInventario}`, producto);
}

// Editar producto
editarProducto(id: number, producto: Producto): Observable<Producto> {
  return this.http.put<Producto>(`${this.urlInventario}/${id}`, producto);
}

// Eliminar producto
eliminarProducto(id: number): Observable<any> {
  return this.http.delete(`${this.urlInventario}${id}`);
}


cambiarPasswordOtroUsuario(user_id: number, new_password: string): Observable<any> {
  return this.http.put(`http://127.0.0.1:8000/api/change-other-password/${user_id}/`, { new_password });
}



}
