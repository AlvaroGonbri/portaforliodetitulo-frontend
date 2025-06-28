import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { APIService } from '../../services/API/api.service';
import { CrearAsignacionComponent } from 'src/app/components/crear-asignacion/crear-asignacion.component';
import { Observable, take } from 'rxjs';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { GTHService } from 'src/app/services/gth/gth.service';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.page.html',
  styleUrls: ['./asignaciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AsignacionesPage implements OnInit {
  asignaciones: any[] = [];
  asignacionesFiltradas: any[] = [];
  tecnicos: any[] = [];
  filtroEstado: string = '';
  filtroTipo: string = '';
  procesandoDevolucion = false;
  alertasVencidas: any[] = [];
  
  filtros: any = {};
  textoBusqueda: string = '';
  
  totalAsignaciones: number = 0;
  herramientasVencidas: number = 0;
  herramientasActivas: number = 0;
  insumosRecientes: number = 0;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private apiService: APIService,
    private logoutService: LogoutService,
    private gthService: GTHService

  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

    logout(): void {
    this.logoutService.logout();
  }

  irAHome() {
    this.gthService.goToHome();
  }

  async cargarDatos() {
    const loading = await this.loadingController.create({
      message: 'Cargando asignaciones...'
    });
    await loading.present();

    try {
      const asignacionesResponse = await this.apiService.getAsignaciones().toPromise();
      const tecnicosResponse = await this.apiService.getTecnicos().toPromise();

      this.asignaciones = asignacionesResponse || [];
      this.tecnicos = tecnicosResponse || [];
      
      
      this.aplicarFiltros();
      this.calcularEstadisticas();
      
      console.log('Asignaciones cargadas:', this.asignaciones);
      console.log('Técnicos cargados:', this.tecnicos);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar los datos', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  aplicarFiltros() {
    this.asignacionesFiltradas = this.asignaciones.filter(asignacion => {
      if (this.filtros.estado && asignacion.Estado !== this.filtros.estado) {
        return false;
      }
      if (this.filtros.tipo_material && asignacion.TipoMaterial !== this.filtros.tipo_material) {
        return false;
      }
      if (this.filtros.tecnico && asignacion.TecnicoID !== this.filtros.tecnico) {
        return false;
      }
      if (this.textoBusqueda) {
        const texto = this.textoBusqueda.toLowerCase();
        return asignacion.producto_data?.nom_producto?.toLowerCase().includes(texto) ||
               asignacion.tecnico_data?.nombre_completo?.toLowerCase().includes(texto) ||
               asignacion.MotivoAsignacion?.toLowerCase().includes(texto) ||
               asignacion.ProyectoTrabajo?.toLowerCase().includes(texto);
      }
      return true;
    });
  }

  calcularEstadisticas() {
    this.totalAsignaciones = this.asignaciones.length;
    this.herramientasVencidas = this.asignaciones.filter(a => a.esta_vencida).length;
    this.herramientasActivas = this.asignaciones.filter(a => 
      a.Estado === 'asignado' && a.TipoMaterial === 'herramienta'
    ).length;
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.insumosRecientes = this.asignaciones.filter(a => 
      a.TipoMaterial === 'insumo' && 
      new Date(a.FechaAsignacion) >= hace30Dias
    ).length;
  }

  limpiarFiltros() {
    this.filtros = {};
    this.textoBusqueda = '';
    this.aplicarFiltros();
  }

  ionViewDidEnter() {
    this.cargarAsignaciones();
  }

  ionViewWillEnter() {
  this.cargarAlertasVencidas();
}

async cargarAlertasVencidas() {
  try {
    const response = await this.apiService.getAlertasVencidas().toPromise();
    this.alertasVencidas = response;
  } catch (error) {
    console.error('Error cargando alertas:', error);
  }

}

  cargarAsignaciones() {
    this.apiService.getAsignaciones().subscribe({
      next: (data) => this.asignaciones = data,
      error: (err) => console.error('Error cargando asignaciones', err)
    });
  }

  async crearAsignacion() {
    const modal = await this.modalController.create({
      component: CrearAsignacionComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.actualizar) {
      this.cargarDatos();
    }
  }

  async gestionarAsignacion(asignacion: any) {
    const alert = await this.alertController.create({
      header: 'Gestionar Asignación',
      subHeader: `${asignacion.producto_data?.nom_producto || 'Producto'}`,
      message: `
        <strong>Técnico:</strong> ${asignacion.tecnico_data?.nombre_completo || 'N/A'}<br>
        <strong>Estado:</strong> ${asignacion.Estado}
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Devolver',
          handler: () => {
            this.devolverAsignacion(asignacion);
            return true;
          }
        },
        {
          text: 'Detalles',
          handler: () => {
            this.verDetalles(asignacion);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // Añadido: método verDetalles para evitar error de compilación
  private verDetalles(asignacion: any) {
    this.mostrarToast('Función de detalles en desarrollo...', 'primary');
    // Aquí puedes implementar la navegación o mostrar un modal de detalles
  }

  // Solo una versión de devolverAsignacion
  private async devolverAsignacion(asignacion: any) {
    if (this.procesandoDevolucion) return;
    this.procesandoDevolucion = true;
    try {
      await this.apiService.devolverAsignacion(
        asignacion.AsignacionID, 
        { cantidad_devuelta: asignacion.CantidadAsignada }
      ).toPromise();
      this.mostrarToast('Devolución exitosa', 'success');
      await this.cargarAsignaciones();
    } catch (error) {
      this.mostrarToast('Error al devolver', 'danger');
    } finally {
      this.procesandoDevolucion = false;
    }
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

  doRefresh(event: any) {
    this.cargarDatos().finally(() => {
      event.target.complete();
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'asignado': return 'success';
      case 'devuelto': return 'medium';
      case 'consumido': return 'primary';
      case 'perdido': return 'warning';
      case 'dañado': return 'danger';
      default: return 'primary';
    }
  }

  getTipoIcon(tipo: string): string {
    return tipo === 'herramienta' ? 'build-outline' : 'cube-outline';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  getTecnicoNombre(tecnicoId: number): string {
    const tecnico = this.tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? (tecnico.nombre_completo || `${tecnico.first_name} ${tecnico.last_name}`) : `Técnico ${tecnicoId}`;
  }

  async abrirModalCrearAsignacion() {
    const modal = await this.modalController.create({
      component: CrearAsignacionComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.actualizar) {
      this.cargarAsignaciones();
    }
  }

  async eliminarAsignacion(id: number) {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      await this.apiService.eliminarAsignacion(id).toPromise();
      this.asignaciones = this.asignaciones.filter(a => a.id !== id);
      this.mostrarToast('Asignación eliminada', 'success');
    } catch (error) {
      this.mostrarToast('Error al eliminar', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async editarAsignacion(asignacion: any) {
    const modal = await this.modalController.create({
      component: CrearAsignacionComponent,
      componentProps: {
        asignacionExistente: asignacion
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.actualizar) {
      this.cargarAsignaciones();
    }
  }

  async marcarComoDevuelta(asignacion: any) {
    if (this.procesandoDevolucion) return;
    this.procesandoDevolucion = true;
    try {
      const payload = {
        cantidad_devuelta: asignacion.CantidadAsignada,
        motivo: 'Devolución manual',
        estado: 'devuelto'
      };
      await this.apiService.devolverAsignacion(
        asignacion.AsignacionID,
        payload
      ).toPromise();
      this.mostrarToast('Devolución exitosa', 'success');
      await this.cargarAsignaciones();
    } catch (error) {
      console.error('Error en devolución:', error);
      this.mostrarToast('Error al procesar devolución', 'danger');
    } finally {
      this.procesandoDevolucion = false;
    }
  }

  get herramientasNoDevueltas() {
  return this.asignacionesFiltradas.filter(
    asignacion =>
      asignacion.TipoMaterial === 'herramienta' &&
      asignacion.Estado === 'asignado'
  );
}

  async devolverHerramienta(asignacion: any) {
  if (this.procesandoDevolucion) return;

  this.procesandoDevolucion = true;
  try {
    await this.apiService.devolverAsignacion(
      asignacion.AsignacionID,
      { cantidad_devuelta: asignacion.CantidadAsignada }
    ).toPromise();
    this.mostrarToast('Herramienta devuelta', 'success');
    await this.cargarAlertasVencidas(); // Recargar alertas después de la acción
  } catch (error) {
    this.mostrarToast('Error al devolver', 'danger');
  } finally {
    this.procesandoDevolucion = false;
  }
}

calcularDiasAtraso(fechaDevolucionEsperada: string): number {
  if (!fechaDevolucionEsperada) return 0;
  
  const fechaEsperada = new Date(fechaDevolucionEsperada);
  const fechaActual = new Date();
  
  // Establecer las horas a 0 para comparar solo fechas
  fechaEsperada.setHours(0, 0, 0, 0);
  fechaActual.setHours(0, 0, 0, 0);
  
  const diferenciaTiempo = fechaActual.getTime() - fechaEsperada.getTime();
  const diasAtraso = Math.floor(diferenciaTiempo / (1000 * 3600 * 24));
  
  return diasAtraso > 0 ? diasAtraso : 0;
}

/**
 * Verifica si una herramienta está vencida
 */
estaVencida(fechaEsperada: string): boolean {
  const fechaDevolucion = new Date(fechaEsperada);
  const hoy = new Date();
  return fechaDevolucion < hoy;
}

/**
 * Obtiene el color del badge según los días de atraso
 */
getColorAtraso(diasAtraso: number): string {
  if (diasAtraso === 0) return 'medium';
  if (diasAtraso <= 3) return 'warning';
  if (diasAtraso <= 7) return 'danger';
  return 'dark'; // Más de 7 días
}


}
