import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import * as XLSX from 'xlsx';
import { AuditoriaItem, Usuario } from './../../models/user.interface';
import { LogoutService } from 'src/app/services/logout/logout.service';
// ✅ IMPORT CORRECTO DEL COMPONENTE MODAL
// Ajusta esta ruta según tu estructura de carpetas:
import { DetalleMovimientoComponent } from '../../components/detalles-movimiento/detalle-movimiento.component';
import { GTHService } from 'src/app/services/gth/gth.service';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.page.html',
  styleUrls: ['./historial-movimientos.page.scss'],
  standalone: false
})
export class HistorialMovimientosPage implements OnInit {
  
  historial: AuditoriaItem[] = [];
  historialFiltrado: AuditoriaItem[] = [];
  usuarios: Usuario[] = [];
  cargando = false;

  // Nuevas propiedades para asignaciones
  asignaciones: any[] = [];
  alertasVencidas: any[] = [];

  filtros = {
    producto: '',
    accion: '',
    usuario: '',
    fecha: ''
  };

  paginaActual = 1;
  itemsPorPagina = 20;
  totalPaginas = 1;

  // Estadísticas ampliadas para incluir asignaciones
  estadisticas = {
    total: 0,
    entradas: 0,
    salidas: 0,
    productos: 0,
    asignaciones: 0,
    devoluciones: 0,
    devolucionesTardias: 0,
    consumos: 0,
    perdidas: 0,
    danos: 0
  };

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private logoutService: LogoutService,
    private gthService: GTHService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarHistorial();
  }

  logout(): void {
    this.logoutService.logout();
  }

  irAHome() {
    this.gthService.goToHome();
  }

  // ==================== CARGA DE DATOS ACTUALIZADA ====================
  async cargarHistorial() {
    this.cargando = true;
    
    try {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // 1. Cargar historial de auditoría tradicional
      let params = new HttpParams();
      
      if (this.filtros.producto) {
        params = params.set('search', this.filtros.producto);
      }
      if (this.filtros.accion && !this.esAccionDeAsignacion(this.filtros.accion)) {
        params = params.set('accion', this.filtros.accion);
      }
      if (this.filtros.usuario) {
        params = params.set('usuario', this.filtros.usuario);
      }
      if (this.filtros.fecha) {
        const fecha = new Date(this.filtros.fecha).toISOString().split('T')[0];
        params = params.set('fecha_accion', fecha);
      }

      params = params.set('ordering', '-fecha_accion');

      const responseAuditoria = await this.http.get<any>(`${this.baseUrl}/rest/auditoria/`, { headers, params }).toPromise();
      
      let historialAuditoria = [];
      if (Array.isArray(responseAuditoria)) {
        historialAuditoria = responseAuditoria;
      } else if (responseAuditoria && responseAuditoria.results && Array.isArray(responseAuditoria.results)) {
        historialAuditoria = responseAuditoria.results;
      } else if (responseAuditoria && Array.isArray(responseAuditoria.data)) {
        historialAuditoria = responseAuditoria.data;
      } else {
        historialAuditoria = [];
      }

      // 2. Cargar historial de asignaciones
      try {
        const responseAsignaciones = await this.http.get<any>(`${this.baseUrl}/rest/asignaciones/`, { headers }).toPromise();
        this.asignaciones = responseAsignaciones || [];
      } catch (errorAsignaciones) {
        console.warn('⚠️ No se pudieron cargar las asignaciones:', errorAsignaciones);
        this.asignaciones = [];
      }

      // 3. Convertir asignaciones a formato de historial
      const historialAsignaciones = this.convertirAsignacionesAHistorial(this.asignaciones);

      // 4. Combinar ambos historiales
      this.historial = [...historialAuditoria, ...historialAsignaciones];

      // 5. Aplicar filtros específicos de asignaciones si es necesario
      if (this.filtros.accion && this.esAccionDeAsignacion(this.filtros.accion)) {
        this.historial = this.historial.filter(item => item.accion === this.filtros.accion);
      }

      // 6. Aplicar filtro de producto a asignaciones también
      if (this.filtros.producto) {
        const productoBusqueda = this.filtros.producto.toLowerCase();
        this.historial = this.historial.filter(item => 
          item.nombre_producto?.toLowerCase().includes(productoBusqueda) ||
          item.codigo_material?.toLowerCase().includes(productoBusqueda)
        );
      }

      // 7. Ordenar por fecha
      this.historial.sort((a, b) => new Date(b.fecha_accion).getTime() - new Date(a.fecha_accion).getTime());
      
      this.aplicarPaginacion();
      this.calcularEstadisticas();
      
    } catch (error) {
      console.error('❌ Error cargando historial:', error);
      this.mostrarToast('Error al cargar el historial', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  // ==================== NUEVOS MÉTODOS PARA ASIGNACIONES ====================
  
  // Método para convertir asignaciones al formato de historial
  convertirAsignacionesAHistorial(asignaciones: any[]): any[] {
  const historialAsignaciones: any[] = [];

  asignaciones.forEach(asignacion => {
    // Basándome en tu código, la estructura parece ser:
    // asignacion.producto_data?.nom_producto
    // asignacion.tecnico_data?.nombre_completo
    // asignacion.usuario_data?.username
    
    const nombreProducto = asignacion.producto_data?.nom_producto || `Producto ID: ${asignacion.ProductoID}`;
    const codigoMaterial = asignacion.producto_data?.codigo_material || `P-${asignacion.ProductoID}`;
    const nombreTecnico = asignacion.tecnico_data?.nombre_completo || `Técnico ID: ${asignacion.TecnicoID}`;
    
    // Entrada por creación de asignación
    historialAsignaciones.push({
      id: `asig_create_${asignacion.AsignacionID}`,
      fecha_accion: asignacion.FechaAsignacion,
      accion: 'crear_asignacion',
      producto_id: asignacion.ProductoID,
      nombre_producto: nombreProducto,
      codigo_material: codigoMaterial,
      cantidad_anterior: null,
      cantidad_nueva: asignacion.CantidadAsignada,
      usuario: {
        username: asignacion.usuario_data?.username || 'Sistema',
        id: asignacion.usuario_data?.id || 0
      },
      categoria: asignacion.producto_data?.categoria || '',
      tipo_producto: asignacion.TipoMaterial,
      descripcion: `Asignación a ${nombreTecnico}`,
      observaciones: asignacion.MotivoAsignacion || '',
      datos_nuevos: {
        tecnico_nombre: nombreTecnico,
        tecnico_id: asignacion.TecnicoID,
        proyecto: asignacion.ProyectoTrabajo,
        motivo: asignacion.MotivoAsignacion,
        fecha_devolucion_esperada: asignacion.FechaDevolucionEsperada
      },
      es_asignacion: true
    });

    // Si está devuelto, agregar entrada de devolución
    if (asignacion.Estado === 'devuelto' && asignacion.FechaDevolucion) {
      const diasAtraso = this.calcularDiasAtraso(asignacion.FechaDevolucionEsperada, asignacion.FechaDevolucion);
      
      historialAsignaciones.push({
        id: `asig_return_${asignacion.AsignacionID}`,
        fecha_accion: asignacion.FechaDevolucion,
        accion: diasAtraso > 0 ? 'devolucion_tardia' : 'devolucion',
        producto_id: asignacion.ProductoID,
        nombre_producto: nombreProducto,
        codigo_material: codigoMaterial,
        cantidad_anterior: asignacion.CantidadAsignada,
        cantidad_nueva: 0,
        usuario: {
          username: asignacion.usuario_data?.username || 'Sistema',
          id: asignacion.usuario_data?.id || 0
        },
        categoria: asignacion.producto_data?.categoria || '',
        tipo_producto: asignacion.TipoMaterial,
        descripcion: `Devolución de ${nombreTecnico}${diasAtraso > 0 ? ` (${diasAtraso} días de atraso)` : ''}`,
        observaciones: asignacion.ObservacionesDevolucion || '',
        datos_nuevos: {
          tecnico_nombre: nombreTecnico,
          dias_atraso: diasAtraso,
          fecha_devolucion_esperada: asignacion.FechaDevolucionEsperada
        },
        es_asignacion: true
      });
    }

    // Si está consumido
    if (asignacion.Estado === 'consumido') {
      historialAsignaciones.push({
        id: `asig_consume_${asignacion.AsignacionID}`,
        fecha_accion: asignacion.FechaDevolucion || asignacion.FechaAsignacion,
        accion: 'consumo',
        producto_id: asignacion.ProductoID,
        nombre_producto: nombreProducto,
        codigo_material: codigoMaterial,
        cantidad_anterior: asignacion.CantidadAsignada,
        cantidad_nueva: 0,
        usuario: {
          username: asignacion.usuario_data?.username || 'Sistema',
          id: asignacion.usuario_data?.id || 0
        },
        categoria: asignacion.producto_data?.categoria || '',
        tipo_producto: asignacion.TipoMaterial,
        descripcion: `Consumo por ${nombreTecnico}`,
        observaciones: asignacion.ObservacionesDevolucion || '',
        datos_nuevos: {
          tecnico_nombre: nombreTecnico,
          proyecto: asignacion.ProyectoTrabajo
        },
        es_asignacion: true
      });
    }

    // Si está perdido o dañado
    if (asignacion.Estado === 'perdido' || asignacion.Estado === 'dañado') {
      historialAsignaciones.push({
        id: `asig_loss_${asignacion.AsignacionID}`,
        fecha_accion: asignacion.FechaDevolucion || asignacion.FechaAsignacion,
        accion: asignacion.Estado === 'perdido' ? 'perdida' : 'dano',
        producto_id: asignacion.ProductoID,
        nombre_producto: nombreProducto,
        codigo_material: codigoMaterial,
        cantidad_anterior: asignacion.CantidadAsignada,
        cantidad_nueva: 0,
        usuario: {
          username: asignacion.usuario_data?.username || 'Sistema',
          id: asignacion.usuario_data?.id || 0
        },
        categoria: asignacion.producto_data?.categoria || '',
        tipo_producto: asignacion.TipoMaterial,
        descripcion: `${asignacion.Estado === 'perdido' ? 'Pérdida' : 'Daño'} reportado por ${nombreTecnico}`,
        observaciones: asignacion.ObservacionesDevolucion || '',
        datos_nuevos: {
          tecnico_nombre: nombreTecnico,
          estado_anterior: 'asignado',
          estado_nuevo: asignacion.Estado
        },
        es_asignacion: true
      });
    }
  });

  console.log('📦 Historial de asignaciones convertido:', historialAsignaciones); // Debug temporal
  return historialAsignaciones;
}

  async cargarProductosCompletos() {
  try {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Cargar productos para tener la información completa
    const productos = await this.http.get<any>(`${this.baseUrl}/rest/materiales/`, { headers }).toPromise();
    console.log('📦 Productos disponibles:', productos);
    
    return productos;
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar los productos:', error);
    return [];
  }
}

// MÉTODO MEJORADO PARA CARGAR HISTORIAL CON PRODUCTOS


  // Método auxiliar para calcular días de atraso
  calcularDiasAtraso(fechaEsperada: string, fechaReal: string): number {
    if (!fechaEsperada || !fechaReal) return 0;
    
    const esperada = new Date(fechaEsperada);
    const real = new Date(fechaReal);
    
    esperada.setHours(0, 0, 0, 0);
    real.setHours(0, 0, 0, 0);
    
    const diferencia = real.getTime() - esperada.getTime();
    const dias = Math.floor(diferencia / (1000 * 3600 * 24));
    
    return dias > 0 ? dias : 0;
  }

  // Verificar si una acción es de asignación
  esAccionDeAsignacion(accion: string): boolean {
    const accionesAsignacion = [
      'crear_asignacion', 'devolucion', 'devolucion_tardia', 
      'consumo', 'perdida', 'dano'
    ];
    return accionesAsignacion.includes(accion);
  }

  // Función para obtener el técnico asignado
  getTecnicoAsignado(item: any): string {
    if (item.es_asignacion && item.datos_nuevos?.tecnico_nombre) {
      return item.datos_nuevos.tecnico_nombre;
    }
    return '';
  }

  // Función para determinar si mostrar información de atraso
  mostrarInfoAtraso(item: any): boolean {
    return item.accion === 'devolucion_tardia' && item.datos_nuevos?.dias_atraso > 0;
  }

  // Función para obtener días de atraso
  getDiasAtraso(item: any): number {
    return item.datos_nuevos?.dias_atraso || 0;
  }

  // ==================== MÉTODOS ORIGINALES ACTUALIZADOS ====================

  async cargarUsuarios() {
    try {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await this.http.get<Usuario[]>(`${this.baseUrl}/users/`, { headers }).toPromise();
      this.usuarios = response || [];
      
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    }
  }

  // ==================== FILTROS ====================
  aplicarFiltros() {
    this.paginaActual = 1;
    this.cargarHistorial();
  }

  limpiarFiltros() {
    this.filtros = {
      producto: '',
      accion: '',
      usuario: '',
      fecha: ''
    };
    this.cargarHistorial();
  }

  // ==================== PAGINACIÓN ====================
  aplicarPaginacion() {
    this.totalPaginas = Math.ceil(this.historial.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.historialFiltrado = this.historial.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.aplicarPaginacion();
    }
  }

  getPaginas(): number[] {
    const paginas = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);
    
    if (fin - inicio + 1 < maxPaginas) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  // ==================== ESTADÍSTICAS ACTUALIZADAS ====================
  calcularEstadisticas() {
    this.estadisticas.total = this.historial.length;
    
    // Movimientos de entrada/creación
    const accionesEntrada = ['stock_entrada', 'crear', 'devolucion', 'devolucion_tardia'];
    this.estadisticas.entradas = this.historial.filter(item => 
      accionesEntrada.includes(item.accion)
    ).length;
    
    // Movimientos de salida/asignación
    const accionesSalida = ['stock_salida', 'eliminar', 'crear_asignacion', 'consumo', 'perdida', 'dano'];
    this.estadisticas.salidas = this.historial.filter(item => 
      accionesSalida.includes(item.accion)
    ).length;
    
    this.estadisticas.productos = new Set(this.historial.map(item => item.producto_id)).size;
    
    // Estadísticas específicas de asignaciones
    this.estadisticas.asignaciones = this.historial.filter(item => item.accion === 'crear_asignacion').length;
    this.estadisticas.devoluciones = this.historial.filter(item => 
      ['devolucion', 'devolucion_tardia'].includes(item.accion)
    ).length;
    this.estadisticas.devolucionesTardias = this.historial.filter(item => item.accion === 'devolucion_tardia').length;
    this.estadisticas.consumos = this.historial.filter(item => item.accion === 'consumo').length;
    this.estadisticas.perdidas = this.historial.filter(item => item.accion === 'perdida').length;
    this.estadisticas.danos = this.historial.filter(item => item.accion === 'dano').length;
  }

  // ==================== HELPERS ACTUALIZADOS ====================
  getColorAccion(accion: string): string {
    const colores: { [key: string]: string } = {
      // Movimientos de Inventario
      'crear': 'success',
      'editar': 'warning',
      'stock_entrada': 'primary',
      'stock_salida': 'danger',
      'eliminar': 'dark',
      
      // Movimientos de Asignaciones
      'crear_asignacion': 'tertiary',
      'devolucion': 'success',
      'devolucion_tardia': 'warning',
      'consumo': 'danger',
      'perdida': 'dark',
      'dano': 'danger'
    };
    return colores[accion] || 'medium';
  }

  getIconoAccion(accion: string): string {
    const iconos: { [key: string]: string } = {
      // Movimientos de Inventario
      'crear': '✅',
      'editar': '✏️',
      'stock_entrada': '📈',
      'stock_salida': '📉',
      'eliminar': '🗑️',
      
      // Movimientos de Asignaciones
      'crear_asignacion': '📦',
      'devolucion': '↩️',
      'devolucion_tardia': '⚠️',
      'consumo': '🔥',
      'perdida': '❌',
      'dano': '💥'
    };
    return iconos[accion] || '📝';
  }

  getTextoAccion(accion: string): string {
    const textos: { [key: string]: string } = {
      // Movimientos de Inventario
      'crear': 'Crear Producto',
      'editar': 'Editar Producto',
      'stock_entrada': 'Entrada de Stock',
      'stock_salida': 'Salida de Stock',
      'eliminar': 'Eliminar Producto',
      
      // Movimientos de Asignaciones
      'crear_asignacion': 'Crear Asignación',
      'devolucion': 'Devolución',
      'devolucion_tardia': 'Devolución Tardía',
      'consumo': 'Consumo',
      'perdida': 'Pérdida',
      'dano': 'Daño'
    };
    return textos[accion] || accion;
  }

  getCambioColor(item: AuditoriaItem): string {
    if (item.cantidad_anterior === null || item.cantidad_nueva === null) return '#666';
    
    const cambio = item.cantidad_nueva - item.cantidad_anterior;
    if (cambio > 0) return '#4CAF50';
    if (cambio < 0) return '#F44336';
    return '#666';
  }

  getCambioTexto(item: AuditoriaItem): string {
    if (item.cantidad_anterior === null || item.cantidad_nueva === null) return '';
    
    const cambio = item.cantidad_nueva - item.cantidad_anterior;
    if (cambio > 0) return `(+${cambio})`;
    if (cambio < 0) return `(${cambio})`;
    return '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackById(index: number, item: AuditoriaItem): number {
    return typeof item.id === 'string' ? index : item.id;
  }

  // ==================== MODAL DE DETALLES - MÉTODO PRINCIPAL ====================
  async verDetalles(item: AuditoriaItem) {
    console.log('🔍 Intentando abrir modal para:', item);
    
    try {
      // ✅ INTENTAR CREAR EL MODAL PRIMERO
      const modal = await this.modalController.create({
        component: DetalleMovimientoComponent,
        componentProps: {
          movimiento: item
        },
        cssClass: 'modal-detalles-fullscreen',
        backdropDismiss: true,
        showBackdrop: true
      });

      // ✅ MANEJAR CIERRE DEL MODAL
      modal.onDidDismiss().then((result) => {
        console.log('🔄 Modal cerrado:', result);
      });

      // ✅ PRESENTAR EL MODAL
      await modal.present();
      console.log('✅ Modal presentado exitosamente');

    } catch (error) {
      console.error('❌ Error creando modal:', error);
      
      // ✅ FALLBACK: Usar alert si falla el modal
      console.log('🔄 Usando fallback con alert...');
      this.verDetallesConAlert(item);
    }
  }

  // ✅ MÉTODO DE FALLBACK (solo para emergencias)
  async verDetallesConAlert(item: AuditoriaItem) {
    const alert = await this.alertController.create({
      header: '📋 Detalles del Movimiento',
      message: `
        <div style="text-align: left; line-height: 1.6;">
          <strong>Producto:</strong> ${item.nombre_producto}<br>
          <strong>Código:</strong> ${item.codigo_material}<br>
          <strong>Acción:</strong> ${this.getTextoAccion(item.accion)}<br>
          <strong>Usuario:</strong> ${item.usuario?.username || 'Sistema'}<br>
          <strong>Fecha:</strong> ${this.formatearFecha(item.fecha_accion)} ${this.formatearHora(item.fecha_accion)}
          ${this.getTecnicoAsignado(item) ? `<br><strong>Técnico:</strong> ${this.getTecnicoAsignado(item)}` : ''}
        </div>
      `,
      buttons: [
        {
          text: 'Ver JSON',
          handler: () => this.verDatosJSON(item)
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async verDatosJSON(item: AuditoriaItem) {
    const datos = {
      datos_anteriores: item.datos_anteriores,
      datos_nuevos: item.datos_nuevos
    };

    const alert = await this.alertController.create({
      header: '📄 Datos JSON',
      message: `<pre style="font-size: 12px; text-align: left; white-space: pre-wrap;">${JSON.stringify(datos, null, 2)}</pre>`,
      buttons: ['Cerrar'],
      cssClass: 'json-alert'
    });

    await alert.present();
  }

  // ==================== EXPORTACIÓN ACTUALIZADA ====================
  async exportarHistorial() {
    try {
      const loading = await this.loadingController.create({
        message: 'Generando archivo Excel...'
      });
      await loading.present();

      const datosExport = this.historial.map(item => ({
        'Fecha': this.formatearFecha(item.fecha_accion),
        'Hora': this.formatearHora(item.fecha_accion),
        'Acción': this.getTextoAccion(item.accion),
        'Código Producto': item.codigo_material,
        'Nombre Producto': item.nombre_producto,
        'Cantidad Anterior': item.cantidad_anterior || '',
        'Cantidad Nueva': item.cantidad_nueva || '',
        'Cambio': this.getCambioTexto(item),
        'Usuario': item.usuario?.username || 'Sistema',
        'Técnico Asignado': this.getTecnicoAsignado(item) || '',
        'Días Atraso': this.mostrarInfoAtraso(item) ? this.getDiasAtraso(item) : '',
        'IP': item.ip_address || '',
        'Categoría': item.categoria || '',
        'Tipo': item.tipo_producto || '',
        'Descripción': item.descripcion,
        'Observaciones': item.observaciones || ''
      }));

      const ws = XLSX.utils.json_to_sheet(datosExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Historial Movimientos');

      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `historial_movimientos_${fecha}.xlsx`);

      await loading.dismiss();
      this.mostrarToast('✅ Archivo exportado correctamente', 'success');

    } catch (error) {
      console.error('❌ Error exportando:', error);
      this.mostrarToast('Error al exportar el archivo', 'danger');
    }
  }

  // ==================== UTILIDADES ====================
  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

}