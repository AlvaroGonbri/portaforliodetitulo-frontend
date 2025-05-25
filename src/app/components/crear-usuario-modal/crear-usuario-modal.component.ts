import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private modalController: ModalController,
    private apiService: APIService
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
  // Si groups es un array de objetos {id, name}
  if (this.usuario.groups && this.usuario.groups.length > 0) {
    // Si es edición y groups es array de objetos
    this.usuario.grupoSeleccionado = this.usuario.groups[0].id;
    // Si fuera array de IDs, sería: this.usuario.grupoSeleccionado = this.usuario.groups[0];
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


  dismiss() {
    this.modalController.dismiss();
  }

  crearUsuario() {
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
