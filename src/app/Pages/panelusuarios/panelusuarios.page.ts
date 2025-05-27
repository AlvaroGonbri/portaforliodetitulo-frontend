import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { users, groups } from '../../models/user.interface';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { CrearUsuarioModalComponent } from 'src/app/components/crear-usuario-modal/crear-usuario-modal.component';
<<<<<<< HEAD
import { LogoutService } from 'src/app/services/logout/logout.service';
=======
>>>>>>> 304ff261aa42335b21c4de64357d9bb487f43bea

@Component({
  selector: 'app-panelusuarios',
  templateUrl: 'panelusuarios.page.html',
  styleUrls: ['panelusuarios.page.scss'],
  standalone: false,
})
export class PanelusuariosPage implements OnInit {

  items: users[] = [];
  grupos: groups[] = [];

  getRolesNames(groups: { id: number, name: string }[]): string {
    if (!groups || groups.length === 0) return '-';
    return groups.map(g => g.name).join(', ');
  }

  constructor(
    private servicioAPI: APIService,
    private authService: AuthenticationService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
<<<<<<< HEAD
    private toastController: ToastController, // Agregado para mostrar mensajes toast
    private logoutService : LogoutService
=======
    private toastController: ToastController // Agregado para mostrar mensajes toast
>>>>>>> 304ff261aa42335b21c4de64357d9bb487f43bea
  ) { }

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

  logout(): void {
<<<<<<< HEAD
  this.logoutService.logout();
}

=======
    this.authService.logout();
    this.router.navigate(['/login']);
  }
>>>>>>> 304ff261aa42335b21c4de64357d9bb487f43bea

  actualizarUsuarios(): void {
    localStorage.removeItem('usuarios');
    this.cargarUsuarios();
  }

  async crearUsuario() {
    const modal = await this.modalController.create({
      component: CrearUsuarioModalComponent,
      cssClass: 'my-custom-modal-css'
    });
    await modal.present();

    // Opcional: Recibir datos al cerrar el modal
    const { data } = await modal.onDidDismiss();
    if (data) {
      // Aquí puedes enviar los datos a tu API o actualizar la lista de usuarios
      console.log('Usuario creado:', data);
    }
  }

  async eliminarUsuario(id: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar usuario?',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.servicioAPI.eliminarUsuario(id).subscribe({
              next: () => {
                // Elimina el usuario de la lista local
                this.items = this.items.filter(u => u.id !== id);
                // Opcional: actualiza localStorage
                localStorage.setItem('usuarios', JSON.stringify(this.items));
              },
              error: (err) => {
                console.error('Error al eliminar usuario', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async editarUsuario(usuario: any) {
    const modal = await this.modalController.create({
      component: CrearUsuarioModalComponent,
      componentProps: {
        usuario: JSON.parse(JSON.stringify(usuario)), // deep copy
        grupos: this.grupos
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      // Actualiza solo el usuario editado en el array items
      const idx = this.items.findIndex(u => u.id === data.id);
      if (idx !== -1) {
        this.items[idx] = { ...this.items[idx], ...data };
        localStorage.setItem('usuarios', JSON.stringify(this.items));
      }
      // Mostrar toast de éxito
      const toast = await this.toastController.create({
        message: 'Usuario actualizado exitosamente',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }
}