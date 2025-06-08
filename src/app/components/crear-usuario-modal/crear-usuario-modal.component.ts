import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { APIService } from '../../services/API/api.service';

@Component({
  selector: 'app-crear-usuario-modal',
  templateUrl: './crear-usuario-modal.component.html',
  styleUrls: ['./crear-usuario-modal.component.scss'],
  standalone: false
})
export class CrearUsuarioModalComponent implements OnInit {
  @Input() usuario: any; // Para editar, recibe el usuario a editar
  @Input() grupos: any[] = []; // Si se pasan grupos desde afuera, no los carga
  new_password = ''; // Nueva contraseña

  constructor(
    private modalController: ModalController,
    private apiService: APIService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (!this.usuario) {
      this.usuario = {
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        cargo: '',
        grupoSeleccionado: null
      };
    }
    if (this.usuario.groups && this.usuario.groups.length > 0) {
      this.usuario.grupoSeleccionado = this.usuario.groups[0].id;
    } else {
      this.usuario.grupoSeleccionado = null;
    }
    if (!this.grupos || this.grupos.length === 0) {
      this.apiService.getgroups().subscribe({
        next: (grupos) => { this.grupos = grupos; },
        error: (err) => { console.error('Error al obtener grupos', err); }
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  // Método para cambiar la contraseña de otro usuario
  async cambiarPasswordOtroUsuario() {
    if (this.usuario.id && this.new_password) {
      try {
        const respuesta = await this.apiService.cambiarPasswordOtroUsuario(this.usuario.id, this.new_password).toPromise();
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Contraseña cambiada correctamente',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.new_password = ''; // Limpiar el campo después del cambio
      } catch (err: any) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.error || 'La contraseña no cumple con los requisitos mínimos',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    }
  }

  async mostrarToastExito() {
    const toast = await this.toastController.create({
      message: 'Usuario guardado con éxito',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  async crearUsuario() {
    const usuarioParaEnviar = {
      ...this.usuario,
      groups_ids: [this.usuario.grupoSeleccionado],
      profile: { cargo: this.usuario.cargo }
    };
    if (!usuarioParaEnviar.password) {
      delete usuarioParaEnviar.password;
    }
    // Si el usuario tiene id, es una edición
    if (this.usuario.id) {
      this.apiService.editarUsuario(this.usuario.id, usuarioParaEnviar).subscribe({
        next: async (respuesta) => {
          await this.mostrarToastExito();
          this.modalController.dismiss(usuarioParaEnviar);
        },
        error: (err) => {
          console.error('Error al editar usuario', err);
        }
      });
    } else {
      // Si no tiene id, es una creación
      this.apiService.crearUsuario(usuarioParaEnviar).subscribe({
        next: async (respuesta) => {
          await this.mostrarToastExito();
          this.modalController.dismiss(usuarioParaEnviar);
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
        }
      });
    }
  }
}
