// ==================== detalle-movimiento.component.ts ====================

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuditoriaItem } from './../../models/user.interface';

@Component({
  selector: 'app-detalle-movimiento',
  templateUrl: './detalle-movimiento.component.html',
  styleUrls: ['./detalle-movimiento.component.scss'],
  standalone: false
})
export class DetalleMovimientoComponent implements OnInit {

  // ✅ RECIBIR DATOS DEL MODAL - Hacer que pueda ser undefined
  @Input() movimiento: AuditoriaItem | undefined;

  // ✅ PROPIEDADES DEL COMPONENTE
  mostrarDatosTecnicos = false;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log('📋 Modal de detalles inicializado con:', this.movimiento);
  }

  // ==================== MÉTODOS DEL MODAL ====================

  async cerrar() {
    console.log('🔄 Cerrando modal de detalles');
    await this.modalController.dismiss();
  }

  async cerrarConDatos(datos?: any) {
    console.log('🔄 Cerrando modal con datos:', datos);
    await this.modalController.dismiss(datos, 'confirm');
  }

  // ==================== MÉTODOS HELPER PARA LA VISTA ====================

  getColorAccion(accion?: string): string {
    if (!accion) return 'medium';
    
    const colores: { [key: string]: string } = {
      'crear': 'success',
      'editar': 'warning',
      'stock_entrada': 'primary',
      'stock_salida': 'danger',
      'eliminar': 'dark'
    };
    return colores[accion] || 'medium';
  }

  getIconoAccion(accion?: string): string {
    if (!accion) return 'document';
    
    const iconos: { [key: string]: string } = {
      'crear': 'add-circle',
      'editar': 'create',
      'stock_entrada': 'trending-up',
      'stock_salida': 'trending-down',
      'eliminar': 'trash'
    };
    return iconos[accion] || 'document';
  }

  getTextoAccion(accion?: string): string {
    if (!accion) return 'Desconocido';
    
    const textos: { [key: string]: string } = {
      'crear': 'Crear',
      'editar': 'Editar',
      'stock_entrada': 'Entrada',
      'stock_salida': 'Salida',
      'eliminar': 'Eliminar'
    };
    return textos[accion] || accion;
  }

  formatearFechaCompleta(fecha?: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return fecha;
    }
  }

  getTiempoTranscurrido(fecha?: string): string {
    if (!fecha) return 'Desconocido';
    
    try {
      const now = new Date();
      const past = new Date(fecha);
      const diffMs = now.getTime() - past.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffMinutes > 0) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      return 'Hace un momento';
    } catch {
      return 'Tiempo desconocido';
    }
  }

  getCambioColor(): string {
    if (!this.movimiento || 
        this.movimiento.cantidad_anterior === null || 
        this.movimiento.cantidad_nueva === null) {
      return 'medium';
    }
    
    const cambio = this.movimiento.cantidad_nueva - this.movimiento.cantidad_anterior;
    if (cambio > 0) return 'success';
    if (cambio < 0) return 'danger';
    return 'medium';
  }

  getCambioTexto(): string {
    if (!this.movimiento || 
        this.movimiento.cantidad_anterior === null || 
        this.movimiento.cantidad_nueva === null) {
      return '';
    }
    
    const cambio = this.movimiento.cantidad_nueva - this.movimiento.cantidad_anterior;
    if (cambio > 0) return `+${cambio}`;
    if (cambio < 0) return `${cambio}`;
    return '0';
  }

  getFullName(): string {
    if (!this.movimiento?.usuario) return '';
    
    const usuario = this.movimiento.usuario as any;
    const firstName = usuario.first_name || usuario.firstName || '';
    const lastName = usuario.last_name || usuario.lastName || '';
    
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || usuario.username || 'Usuario';
  }

  formatJSON(data: any): string {
    if (!data) return 'No hay datos';
    
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Error al formatear datos';
    }
  }
}