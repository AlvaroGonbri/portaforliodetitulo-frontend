import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/Menu/menu.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  userPages: any[] = [];

  constructor(
    private menuService: MenuService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    // Obtén los roles del usuario desde el localStorage o el servicio
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.userPages = this.menuService.getUserPages(userRoles);
  }

  logout() {
    this.authService.logout(); // Llama al método de logout de tu servicio
    // Redirige al login (ajusta según tu app)
    window.location.href = '/login';
  }
}