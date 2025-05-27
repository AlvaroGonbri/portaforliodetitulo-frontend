import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIService } from '../../services/API/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-usuario-modal',
  templateUrl: './crear-usuario-modal.component.html',
  styleUrls: ['./crear-usuario-modal.component.scss'],
  standalone: false
})
export class CrearUsuarioModalComponent implements OnInit {
  @Input() usuario: any; // Para editar, recibe el usuario a editar
  @Input() grupos: any[] = []; // Si se pasan grupos desde afuera, no los carga

  // Variable para la nueva contraseña (solo se usa para sobreescribir la clave)
  new_password = ''; // Nueva contraseña

  constructor(
    private modalController: ModalController,
    private apiService: APIService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // Si no se pasa un usuario, inicializa uno nuevo
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
    // Si el usuario tiene grupos, inicializa el grupo seleccionado
    if (this.usuario.groups && this.usuario.groups.length > 0) {
      this.usuario.grupoSeleccionado = this.usuario.groups[0].id;
    } else {
      this.usuario.grupoSeleccionado = null;
    }
    // Si no se pasan grupos, carga los grupos
    if (!this.grupos || this.grupos.length === 0) {
      this.apiService.getgroups().subscribe({
        next: (grupos) => { this.grupos = grupos; },
        error: (err) => { console.error('Error al obtener grupos', err); }
      });
    }
  }

  // Método para cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }

  // Método para cambiar la contraseña de otro usuario (solo nueva contraseña)
  async cambiarPasswordOtroUsuario() {
    if (this.usuario.id && this.new_password) {
      try {
        // Enviar solo la nueva contraseña al endpoint seguro
        const respuesta = await this.apiService.cambiarPasswordOtroUsuario(this.usuario.id, this.new_password).toPromise();
        // Mostrar mensaje de éxito
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Contraseña cambiada correctamente',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.new_password = ''; // Limpiar el campo después del cambio
      } catch (err: any) {
        // Mostrar mensaje de error
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.error || 'La contraseña no cumple con los requisitos minimos',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    }
  }

  // Método para crear o editar usuario
  async crearUsuario() {
    // Preparar el objeto usuario para enviar al backend
    const usuarioParaEnviar = {
      ...this.usuario,
      groups_ids: [this.usuario.grupoSeleccionado],
      profile: { cargo: this.usuario.cargo }
    };
    // Si no se ingresó contraseña, no enviarla (para evitar enviar vacío)
    if (!usuarioParaEnviar.password) {
      delete usuarioParaEnviar.password;
    }

    // Si el usuario tiene id, es una edición
    if (this.usuario.id) {
      this.apiService.editarUsuario(this.usuario.id, usuarioParaEnviar).subscribe({
        next: (respuesta) => {
          this.modalController.dismiss(usuarioParaEnviar);
        },
        error: (err) => {
          console.error('Error al editar usuario', err);
        }
      });
    } else {
      // Si no tiene id, es una creación
      this.apiService.crearUsuario(usuarioParaEnviar).subscribe({
        next: (respuesta) => {
          this.modalController.dismiss(usuarioParaEnviar);
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
        }
      });
    }
  }
}
