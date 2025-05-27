import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { APIService } from 'src/app/services/API/api.service';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { Producto } from 'src/app/models/user.interface';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.page.html',
  styleUrls: ['./gestion-inventario.page.scss'],
  standalone: false,
})
export class GestionInventarioPage implements OnInit {

  productos: any[] = [];
  loading = true;

  constructor(
    private apiService: APIService,
    private alertCtrl: AlertController,
    private logoutService : LogoutService
  ) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.apiService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError('Error al cargar los productos');
      }
    });
  }

  editarProducto(producto: Producto) {
  // Aquí puedes abrir un modal o navegar a una página de edición
  // y pasar el producto como parámetro
}

eliminarProducto(id: number) {
  this.apiService.eliminarProducto(id).subscribe({
    next: () => this.cargarProductos(), // Recarga la lista después de eliminar
    error: (err) => console.error('Error al eliminar producto', err)
  });
}


  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

    logout(): void {
  this.logoutService.logout();
}
}
