import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, take } from 'rxjs';

import { 
  TipoProducto, 
  users, 
  groups, 
  userProfile, 
  Producto, 
  Categoria,
  Tecnico,
  CrearAsignacion,
  Devolucion,
  FiltrosAsignacion,
  ProductoAsignacion,
  Asignacion,
  Multa

} from 'src/app/models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class APIService {

  urlUsers = "http://127.0.0.1:8000/users/";
  urlGroups = "http://127.0.0.1:8000/groups/";
  urlBase = "http://127.0.0.1:8000/rest/"
  urlInventario = "http://127.0.0.1:8000/rest/productos/";
  urlCategorias = "http://127.0.0.1:8000/rest/categorias/"

 
  private apiKey: string = 'ac5288cad4f1df04bc4d56fe6af374efb057ec4b';

  constructor(private http: HttpClient) { }

//Inicio Gestion de usuarios

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

cambiarPasswordOtroUsuario(user_id: number, new_password: string): Observable<any> {
  return this.http.put(`http://127.0.0.1:8000/api/change-other-password/${user_id}/`, { new_password });
}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlCategorias);
  }


// Fin Gestion de usuarios

// Inicio Gestion de Productos
getProductos(params?: { search?: string; categoria?: number }): Observable<Producto[]> {
  return this.http.get<Producto[]>(`${this.urlBase}productos/`, { params });
}


// Crear producto
crearProducto(producto: Producto): Observable<Producto> {
  return this.http.post<Producto>(`${this.urlInventario}`, producto);
}

// Editar producto
editarProducto(producto: Producto): Observable<Producto> {
  return this.http.patch<Producto>(`${this.urlInventario}${producto.id}/`, producto);
}

// Eliminar producto
eliminarProducto(id: number): Observable<any> {
  return this.http.delete(`${this.urlInventario}${id}`);
}

getTiposProducto(): Observable<TipoProducto[]> {
  return this.http.get<TipoProducto[]>(`${this.urlBase}tipos/`);

}

// Fin Gestion de Productos

// Métodos específicos para asignaciones
getProductosDisponibles(): Observable<Producto[]> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get<ProductoAsignacion[]>(`${this.urlBase}asignaciones/materiales_disponibles/`, { headers });
}

getProductosParaAsignacion(): Observable<Producto[]> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get<Producto[]>(`${this.urlInventario}`, { headers });
}


getTecnicosParaAsignacion(): Observable<Tecnico[]> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get<Tecnico[]>(`${this.urlBase}tecnicos/`, { headers });
}

crearAsignacion(asignacion: any): Observable<any> {
  return this.http.post(`${this.urlBase}asignaciones/`, asignacion);
}


actualizarAsignacion(id: number, asignacion: Asignacion): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.urlBase}asignaciones/${id}/`, asignacion);
  }

  eliminarAsignacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}asignaciones/${id}/`);
  }

reportarPerdida(asignacionId: number, motivo: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.post(`${this.urlBase}asignaciones/${asignacionId}/reportar_perdida/`, { motivo }, { headers });
}

reportarDano(asignacionId: number, motivo: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.post(`${this.urlBase}asignaciones/${asignacionId}/reportar_daño/`, { motivo }, { headers });
}

getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.urlBase}asignaciones/`);
  }

// Agregar método específico para técnicos
getTecnicos(): Observable<users[]> {
  return this.getusers().pipe(
    map((usuarios: users[]) => 
      usuarios.filter(u => 
        u.groups?.some((g: { name: string; }) => g.name === 'Técnico')
      )
    )
  );
}

devolverHerramienta(asignacionId: number, data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.post(`${this.urlBase}asignaciones/${asignacionId}/devolver/`, data, { headers });
}

devolverAsignacion(id: number, data: any): Observable<any> {
  return this.http.post(
    `${this.urlBase}asignaciones/${id}/devolver/`, 
    data
  ).pipe(
    take(1), // Opcional pero recomendado
    catchError(error => {
      console.error('Error en devolución:', error);
      throw error; // Para manejar en el componente
    })
  );
}

getAlertasVencidas(): Observable<any> {
  return this.http.get(`${this.urlBase}alertas-vencidas/`);
}

//Multas

getMultas(): Observable<Multa[]> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get<Multa[]>(`${this.urlBase}multas/multas/`, { headers });
}


actualizarConfiguracionMulta(data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.post(`${this.urlBase}multas/configuracion/actualizar/`, data, { headers });
}

getConfiguracionMulta(): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get(`${this.urlBase}multas/configuracion/actual/`, { headers });
}

getMisMultas(): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Token ${this.apiKey}`
  });
  return this.http.get(`${this.urlBase}multas/me/`, { headers });
}



}









