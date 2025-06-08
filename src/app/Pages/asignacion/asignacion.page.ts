import { Component } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
import { Producto } from 'src/app/models/user.interface';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.page.html',
  styleUrls: ['./asignacion.page.scss'],
  standalone: false
})
export class AsignacionPage {
  asignacion: any = {
    tecnicoid: null,
    productoid: null,
    cantidadasignada: null,
    fechadevolucionesperada: null
  };

  tecnicos: any[] = [];    // Debes reemplazar con tu modelo Tecnico
  productos: Producto[] = [];

  constructor(private apiServicio: APIService) {}

  ionViewDidEnter() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // Cargar técnicos (debes implementar getTecnicos() en APIService)
    this.apiServicio.getTecnicos().subscribe({
      next: (data) => this.tecnicos = data,
      error: (err) => console.error('Error cargando técnicos', err)
    });

    // Cargar productos
    this.apiServicio.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  asignar() {
    if (!this.validarCampos()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.apiServicio.crearAsignacion(this.asignacion).subscribe({
      next: () => {
        alert('Asignación registrada exitosamente!');
        this.limpiarFormulario();
        this.actualizarStockFrontend();
      },
      error: (err) => {
        console.error('Error en asignación:', err);
        alert(`Error: ${err.error?.error || 'Revise la consola para más detalles'}`);
      }
    });
  }

  private validarCampos(): boolean {
    return !!this.asignacion.tecnicoid && 
           !!this.asignacion.productoid && 
           !!this.asignacion.cantidadasignada;
  }

  private limpiarFormulario() {
    this.asignacion = {
      tecnicoid: null,
      productoid: null,
      cantidadasignada: null,
      fechadevolucionesperada: null
    };
  }

  private actualizarStockFrontend() {
    // Actualizar lista de productos después de la asignación
    this.apiServicio.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error actualizando productos', err)
    });
  }


}
