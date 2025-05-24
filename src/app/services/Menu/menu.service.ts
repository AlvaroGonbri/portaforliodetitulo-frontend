import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  availablePages = [

  {
    title: 'Gestion de Usuarios',
    url: '/panelusuarios',
    icon: 'panelusuarios',
    allowedRoles: ['Admin']
  },
  ];

  constructor() { }
  getUserPages(userRoles: string[]): any[] {
    return this.availablePages.filter(page =>
      page.allowedRoles.some(role => userRoles.includes(role))
    );
  }
}
