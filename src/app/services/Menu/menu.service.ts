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
  }
  ];



  constructor() { }
  getUserPages(userRoles: string[]): any[] {
    return this.availablePages.filter(page =>
      page.allowedRoles.some(role => userRoles.includes(role))
    );
  }
}
