import { Component, OnInit } from '@angular/core';
import { APIService, users, groups } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  items: users[] = [];
  grupos: groups[] = [];

  constructor(private servicioAPI: APIService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarGrupos();
  }

  cargarUsuarios(): void {
    const usuarios = localStorage.getItem('usuarios');
    if (usuarios) {
      this.items = JSON.parse(usuarios);
      console.log('Usuarios cargados desde LocalStorage');
    } else {
      this.servicioAPI.getusers().subscribe({
        next: (usuarios) => {
          this.items = usuarios;
          localStorage.setItem('usuarios', JSON.stringify(this.items));
          console.log('Usuarios cargados desde API');
        },
        error: (err) => {
          console.error('Error al obtener usuarios', err);
        }
      });
    }
  }

  cargarGrupos(): void {
    this.servicioAPI.getgroups().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        console.log('Grupos cargados desde API');
      },
      error: (err) => {
        console.error('Error al obtener grupos', err);
      }
    });
  }

  trackById(index: number, item: users | groups): number {
    return item.id;
  }
}
