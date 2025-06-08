import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { Producto,Categoria } from 'src/app/models/user.interface';
import { ModalController } from '@ionic/angular';
import { CrearProductoModalComponent } from 'src/app/components/crear-producto-modal/crear-producto-modal.component';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.page.html',
  styleUrls: ['./gestion-inventario.page.scss'],
  standalone: false,
  
})
export class GestionInventarioPage implements OnInit {

  productos: any[] = [];
  loading = true;
  categorias: Categoria[] = [];
  tipos: any[] = [];

  mostrarAlerta = false;
  alertButtons: any[] = [];
  productoAEliminar: number | null = null;

  constructor(
    private apiService: APIService,
    private logoutService: LogoutService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias()
    this.cargarTipos();
  }



cargarCategorias() {
  this.apiService.getCategorias().subscribe({
    next: (categorias) => {
      this.categorias = categorias;
    },
    error: (err) => {
      this.showError('Error al cargar categorías');
    }
  });
}

cargarTipos() {
  this.apiService.getTiposProducto().subscribe({
    next: (tipos) => {
      this.tipos = tipos;
    },
    error: (err) => {
      this.showError('Error al cargar tipos de producto');
    }
  });
}

cargarProductos() {
    this.loading = true;
    this.apiService.getProductos().subscribe({
      next: (productos) => {
        // Añadir lógica de alertas
        this.productos = productos.map(producto => {
          return {
            ...producto,
            // Calcula el estado de alerta
            alerta: this.calcularAlertaStock(producto)
          };
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError('Error al cargar los productos');
      }
    });
}

// Función auxiliar para determinar el estado
private calcularAlertaStock(producto: any): string {
  if (producto.cant_existencia < producto.stock_minimo) {
    return 'bajo';
  } else if (producto.cant_existencia > producto.stock_maximo) {
    return 'sobre';
  }
  return 'ok';
}

async editarProducto(producto: Producto) {
  
  const modal = await this.modalController.create({
    component: CrearProductoModalComponent,
    componentProps: {
      categorias: this.categorias,
      tipos: this.tipos,
      producto: { ...producto } // Pasa una copia del producto a editar
    }
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) {
    this.apiService.editarProducto({ ...producto, ...data }).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => this.showError('Error al editar producto')
    });
  }
}


  async crearProducto() {
  const modal = await this.modalController.create({
    component: CrearProductoModalComponent,
    componentProps: {
      categorias: this.categorias,  
      tipos: this.tipos
    }
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) {
    this.apiService.crearProducto(data).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => console.error('Error al crear producto', err)
    });
  }
}

  confirmarEliminacion(id: number) {
    this.productoAEliminar = id;
    this.alertButtons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.mostrarAlerta = false;
        }
      },
      {
        text: 'Confirmar',
        role: 'confirm',
        handler: () => {
          if (this.productoAEliminar !== null) {
            this.eliminarProducto(this.productoAEliminar);
          }
          this.mostrarAlerta = false;
        }
      }
    ];
    this.mostrarAlerta = true;
  }

  eliminarProducto(id: number) {
    this.apiService.eliminarProducto(id).subscribe({
      next: () => this.cargarProductos(), // Recarga la lista después de eliminar
      error: (err) => this.showError('Error al eliminar producto')
    });
  }

  async showError(message: string) {
    // Si quieres mostrar un error con ion-alert, puedes adaptar esto.
    // Por ahora, solo usa alert() nativo para mantenerlo simple.
    alert(message);
  }

  logout(): void {
    this.logoutService.logout();
  }
}