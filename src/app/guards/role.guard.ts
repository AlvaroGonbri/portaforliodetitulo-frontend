import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Permite definir uno o varios roles requeridos en la ruta
    const expectedRoles: string[] = route.data['roles'] || [route.data['role']];
    const userRoles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');

    // Log para depuración
    console.log('Roles del usuario:', userRoles, 'Roles requeridos:', expectedRoles);

    // Si el usuario tiene al menos uno de los roles requeridos, permite acceso
    if (expectedRoles.some(role => userRoles.includes(role))) {
      return true;
    }

    // Si no tiene permisos, redirige al login con mensaje
    this.router.navigate(['/login'], {
      queryParams: { error: 'No tienes permisos para acceder a esta página. Consulta a tu administrador.' }
    });
    return false;
  }
}
