import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  availablePages = [

  {
    title: 'Gestion de Usuarios',
    url: '/panelusuarios',
    icon: 'panelusuarios.svg',
    allowedRoles: ['Admin']
  },
  {
    title: 'Gestion de Inventario',
    url: '/gestion-inventario',
    icon: '/gestioninventario.svg',
    allowedRoles: ['Admin']
  },
    {
    title: 'Historial de Movimientos',
    url: '/historial-movimientos',
    icon: '/historialmovimientos.svg',
    allowedRoles: ['Admin']
  },
      {
    title: 'Asignaciones',
    url: '/asignaciones',
    icon: '/Asignaciones.svg',
    allowedRoles: ['Admin']
  },
      {
    title: 'Multas',
    url: '/multas',
    icon: '/Multas.svg',
    allowedRoles: ['Admin']
  },
      {
    title: 'Portal Tecnicos',
    url: '/portal-tecnicos',
    icon: '/Portal-Tecnicos.svg',
    allowedRoles: ['tecnicos']
  }
  ];



  constructor() { }
  getUserPages(userRoles: string[]): any[] {
    return this.availablePages.filter(page =>
      page.allowedRoles.some(role => userRoles.includes(role))
    );
  }
}
