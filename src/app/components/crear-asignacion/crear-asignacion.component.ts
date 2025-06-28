import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { APIService } from '../../services/API/api.service';
import { Producto, Tecnico } from '../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-asignacion',
  templateUrl: './crear-asignacion.component.html',
  styleUrls: ['./crear-asignacion.component.scss'],
  standalone: true,
  imports: [
    IonicModule,         // <--- Necesario para todos los componentes ion-*
    CommonModule,        // <--- Necesario para *ngIf, *ngFor, etc.
    FormsModule,         // <--- Necesario para ngModel
    ReactiveFormsModule  // <--- Necesario para formGroup, formControlName
  ]
})
export class CrearAsignacionComponent implements OnInit {
  asignacionForm: FormGroup;
  productos: Producto[] = [];
  tecnicos: Tecnico[] = [];
  productosFiltrados: Producto[] = [];
  tecnicosFiltrados: Tecnico[] = [];
  productoSeleccionado: Producto | null = null;
  tecnicoSeleccionado: Tecnico | null = null;
  buscarProducto = '';
  buscarTecnico = '';
  

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private apiService: APIService
  ) {
    this.asignacionForm = this.formBuilder.group({
      ProductoID: ['', Validators.required],
      TecnicoID: ['', Validators.required],
      TipoMaterial: ['', Validators.required],
      CantidadAsignada: [1, [Validators.required, Validators.min(1)]],
      FechaDevolucionEsperada: [''],
      MotivoAsignacion: ['', Validators.required],
      ProyectoTrabajo: ['', Validators.required],
      UbicacionTrabajo: [''],
      Observaciones: ['']
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarTecnicos() {
  const loading = await this.loadingController.create({ 
    message: 'Cargando técnicos...' 
  });
  await loading.present();

  try {
    const tecnicosLocal = localStorage.getItem('tecnicos');
    
    if (tecnicosLocal) {
      this.tecnicos = JSON.parse(tecnicosLocal);
      console.log('Técnicos cargados desde localStorage');
    } else {
      const tecnicosResponse = await this.apiService.getTecnicos().toPromise();
      this.tecnicos = tecnicosResponse || [];
      localStorage.setItem('tecnicos', JSON.stringify(this.tecnicos));
      console.log('Técnicos cargados desde API');
    }

    this.tecnicosFiltrados = this.tecnicos;
    
  } catch (error) {
    this.mostrarToast('Error al cargar técnicos', 'danger');
  } finally {
    await loading.dismiss();
  }
}

  getNombreTecnico(tecnico: any): string {
  if (tecnico.nombre_completo) return tecnico.nombre_completo;
  if (tecnico.first_name && tecnico.last_name) {
    return `${tecnico.first_name} ${tecnico.last_name}`;
  }
  return tecnico.username || tecnico.email;
}



  async cargarDatos() {
  const loading = await this.loadingController.create({ message: 'Cargando datos...' });
  await loading.present();
  try {
    const [productosResponse, usuariosResponse] = await Promise.all([
      this.apiService.getProductos().toPromise(),
      this.apiService.getusers().toPromise() // Obtener todos los usuarios
    ]);

    // Filtrar solo técnicos (grupo "Técnico" o profile.cargo "Técnico")
    this.tecnicos = (usuariosResponse || []).filter((u: any) =>
  Array.isArray(u.groups) && u.groups.some((g: any) => g.name === 'tecnicos')
);

    this.productos = (productosResponse || []).filter(p => p.cant_existencia > 0);
    this.productosFiltrados = this.productos;
    this.tecnicosFiltrados = this.tecnicos;

    console.log('Técnicos filtrados:', this.tecnicos); // Verificar en consola

  } catch (error) {
    this.mostrarToast('Error al cargar los datos', 'danger');
  } finally {
    await loading.dismiss();
  }
}


  filtrarProductos() {
    // ...igual a tu lógica
  }

  filtrarTecnicos() {
  const texto = this.buscarTecnico?.toLowerCase() || '';
  this.tecnicosFiltrados = this.tecnicos.filter(t => 
    (t.first_name + ' ' + t.last_name).toLowerCase().includes(texto) ||
    t.username?.toLowerCase().includes(texto) ||
    t.email?.toLowerCase().includes(texto)
  );
}

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.asignacionForm.patchValue({
      ProductoID: producto.id,
      TipoMaterial: this.determinarTipoMaterial(producto),
      CantidadAsignada: 1
    });
    this.configurarValidacionesTipo();
  }

  seleccionarTecnico(tecnico: Tecnico) {
    this.tecnicoSeleccionado = tecnico;
    this.asignacionForm.patchValue({ TecnicoID: tecnico.id });
  }

determinarTipoMaterial(producto: any): string {
  if (!producto?.tipo) return '';
  let tipo = typeof producto.tipo === 'object' ? producto.tipo.nombre : producto.tipo;
  tipo = tipo.toLowerCase();
  if (tipo === 'herramientas') return 'herramienta';
  if (tipo === 'insumos') return 'insumo';
  return tipo;
}




  configurarValidacionesTipo() {
    // ...igual a tu lógica
  }

  validarStock(): boolean {
  if (!this.productoSeleccionado) return false;
  const cantidad = this.asignacionForm.get('CantidadAsignada')?.value;
  if (cantidad > 0 && cantidad <= this.productoSeleccionado.cant_existencia) return true;
  return false; // Valor por defecto si no se cumple la condición
}


  async guardar() {
    if (!this.validarFormulario()) return;
    const loading = await this.loadingController.create({ message: 'Creando asignación...' });
    await loading.present();
    try {
      const formData = {
        ProductoID: this.asignacionForm.value.ProductoID,
        TecnicoID: this.asignacionForm.value.TecnicoID,
        TipoMaterial: this.asignacionForm.value.TipoMaterial,
        CantidadAsignada: this.asignacionForm.value.CantidadAsignada,
        FechaDevolucionEsperada: this.asignacionForm.value.FechaDevolucionEsperada || null,
        MotivoAsignacion: this.asignacionForm.value.MotivoAsignacion,
        ProyectoTrabajo: this.asignacionForm.value.ProyectoTrabajo,
        UbicacionTrabajo: this.asignacionForm.value.UbicacionTrabajo || '',
        Observaciones: this.asignacionForm.value.Observaciones || ''
      };
      await this.apiService.crearAsignacion(formData).toPromise();
      this.mostrarToast('Asignación creada exitosamente', 'success');
      this.cerrar(true);
    } catch (error: any) {
      // ...manejo de errores igual a tu lógica
    } finally {
      await loading.dismiss();
    }
  }

  validarFormulario(): boolean {
  // Validación básica del formulario
  if (this.asignacionForm.invalid) return false;
  
  // Validación de selecciones
  if (!this.productoSeleccionado || !this.tecnicoSeleccionado) return false;
  
  // Validación de stock
  if (!this.validarStock()) return false;
  
  // Validación adicional para herramientas
  if (this.asignacionForm.get('TipoMaterial')?.value === 'herramienta') {
    const fechaDevolucion = this.asignacionForm.get('FechaDevolucionEsperada')?.value;
    if (!fechaDevolucion) return false;
  }

  return true;
}


  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  cerrar(actualizar = false) {
    this.modalController.dismiss({ actualizar });
  }

  getFechaMinima(): string {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    return mañana.toISOString().split('T')[0];
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  getStockColor(producto: Producto): string {
    if (producto.cant_existencia <= producto.stock_minimo) {
      return 'danger';
    } else if (producto.cant_existencia <= producto.stock_minimo * 1.5) {
      return 'warning';
    }
    return 'success';
  }

  getStockText(producto: Producto): string {
    if (producto.cant_existencia <= producto.stock_minimo) {
      return 'Stock Bajo';
    } else if (producto.cant_existencia <= producto.stock_minimo * 1.5) {
      return 'Stock Medio';
    }
    return 'Disponible';
  }

  getNombreCompleto(tecnico: any): string {
  if (!tecnico) return '';
  if (tecnico.first_name || tecnico.last_name) {
    return `${tecnico.first_name || ''} ${tecnico.last_name || ''}`.trim();
  }
  return tecnico.username || tecnico.email || 'Sin nombre';
}
  onBuscarKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && this.tecnicosFiltrados.length > 0) {
    this.seleccionarTecnico(this.tecnicosFiltrados[0]);
    // Opcional: puedes limpiar el campo de búsqueda si lo deseas
    // this.buscarTecnico = '';
  }
}

}
