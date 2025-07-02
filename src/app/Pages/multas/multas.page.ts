import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
import { Multa } from 'src/app/models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.page.html',
  styleUrls: ['./multas.page.scss'],
  standalone: false,
})
export class MultasPage implements OnInit {
  multas: Multa[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  configuracion: any = { montopordia: 0 };
  mensaje: string | null = null;

  constructor(private apiService: APIService, private router: Router) { }

  ngOnInit() {
    this.cargarMultas();
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.apiService.getConfiguracionMulta().subscribe({
      next: (data) => this.configuracion = data,
      error: (err) => this.mensaje = 'Error al cargar configuración'
    });
  }

  guardarConfiguracion() {
    this.apiService.actualizarConfiguracionMulta(this.configuracion).subscribe({
      next: () => this.mensaje = 'Configuración actualizada correctamente',
      error: () => this.mensaje = 'Error al actualizar configuración'
    });
  }

  cargarMultas() {
    this.loading = true;
    this.error = null;
    this.apiService.getMultas().subscribe({
      next: (data: Multa[]) => {
        this.multas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las multas. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  exportarMultasAExcel() {
    // Lógica para exportar multas a Excel
    alert('Funcionalidad de exportar a Excel aún no implementada.');
  }

  verDetalleMulta(multa: Multa) {
    // Lógica para mostrar detalles de la multa
    alert('Detalle de multa: ' + JSON.stringify(multa, null, 2));
  }

  marcarComoPagada(multa: Multa) {
    // Lógica para marcar la multa como pagada
    alert('Funcionalidad para marcar como pagada aún no implementada.');
  }

  // Filtro simple en el componente (en vez de un pipe)
  get multasFiltradas(): Multa[] {
    if (!this.searchTerm) return this.multas;
    const term = this.searchTerm.toLowerCase();
    return this.multas.filter(m =>
      m.AsignacionID.tecnico_data.nombre_completo.toLowerCase().includes(term) ||
      m.AsignacionID.producto_data.nombre.toLowerCase().includes(term)
    );
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    // Limpia la sesión/token según tu lógica
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}