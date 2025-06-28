import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { Producto,Categoria } from 'src/app/models/user.interface';
import { ModalController } from '@ionic/angular';
import { CrearProductoModalComponent } from 'src/app/components/crear-producto-modal/crear-producto-modal.component';
import { IonSearchbar } from '@ionic/angular/standalone';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver';
import { GTHService } from 'src/app/services/gth/gth.service';

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
  searchTerm: string = '';
  categoriaFiltro: number | null = null;

  constructor(
    private apiService: APIService,
    private modalController: ModalController,
    private logoutService: LogoutService,
    private gthService: GTHService
  ) { }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarTipos();
    this.cargarProductos();
  }

  logout(): void {
    this.logoutService.logout();
  }

  irAHome() {
    this.gthService.goToHome();
  }
  // Getter para productos filtrados
  get productosFiltrados() {
    let productosFiltrados = this.productos;

    // Filtrar por término de búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase().trim();
      productosFiltrados = productosFiltrados.filter(producto => {
        const nomProducto = producto.nom_producto ? String(producto.nom_producto).toLowerCase() : '';
        const codMaterial = producto.cod_material ? String(producto.cod_material).toLowerCase() : '';
        const nomCategoria = producto.categoria?.nom_categoria ? String(producto.categoria.nom_categoria).toLowerCase() : '';
        const tipoNombre = producto.tipo_nombre ? String(producto.tipo_nombre).toLowerCase() : '';
        
        return nomProducto.includes(termino) ||
               codMaterial.includes(termino) ||
               nomCategoria.includes(termino) ||
               tipoNombre.includes(termino);
      });
    }

    // Filtrar por categoría
    if (this.categoriaFiltro !== null && this.categoriaFiltro !== undefined) {
      console.log('Filtro seleccionado:', this.categoriaFiltro, 'Tipo:', typeof this.categoriaFiltro);
      productosFiltrados = productosFiltrados.filter(producto => {
        console.log('Producto categoria ID:', producto.categoria?.id, 'Tipo:', typeof producto.categoria?.id);
        // Convertir ambos valores a números para comparar
        const categoriaProducto = Number(producto.categoria?.id);
        const categoriaFiltro = Number(this.categoriaFiltro);
        return categoriaProducto === categoriaFiltro;
      });
    }

    console.log('Productos filtrados:', productosFiltrados.length);
    return productosFiltrados;
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', this.categorias); // Para debug
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
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

          // Debug detallado
          if (this.productos.length > 0) {
            const primerProducto = this.productos[0];
            console.log('=== DEBUG PRODUCTO ===');
            console.log('Nombre:', primerProducto.nom_producto);
            console.log('ID:', primerProducto.id);
            
            // Buscar todos los campos que contengan "categoria"
            Object.keys(primerProducto).forEach(key => {
              if (key.toLowerCase().includes('categoria')) {
                console.log(`Campo categoria encontrado - ${key}:`, primerProducto[key]);
              }
            });
            
            // Mostrar objeto categoria si existe
            if (primerProducto.categoria) {
              console.log('Objeto categoria:', primerProducto.categoria);
              console.log('Tipo de categoria:', typeof primerProducto.categoria);
            }
            
            console.log('=== FIN DEBUG ===');
          }

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

  // Función para comparar categorías en el select
  compareCategoria = (o1: any, o2: any) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };

  // Archivo gestion-inventario.page.ts
exportarAExcel() {
  console.log('Intentando exportar...');
  if (!this.productosFiltrados?.length) {
    console.warn('No hay productos para exportar');
    return;
  }

  try {
    // Prepara los datos a exportar
    const datosExportar = this.productosFiltrados.map(producto => ({
      'Nombre': producto.nom_producto || 'N/A',
      'Código': producto.cod_material || 'Sin código',
      'Stock Actual': producto.cant_existencia ?? 0,
      'Stock Mínimo': producto.stock_minimo ?? 0,
      'Stock Máximo': producto.stock_maximo ?? 0,
      'Categoría': producto.categoria?.nom_categoria || 'Sin categoría',
      'Tipo': producto.tipo_nombre || 'N/A',
      'Estado Stock': producto.alerta?.toUpperCase() ?? 'SIN ESTADO'
    }));

    // Genera la hoja de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Productos');

    // Escribe el archivo y lo descarga
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Reporte_Productos_${new Date().toISOString().slice(0,10)}.xlsx`);

    console.log('Exportación completada.');
  } catch (error) {
    console.error('Error al exportar:', error);
  }
}

}