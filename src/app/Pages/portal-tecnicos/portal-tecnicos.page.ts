import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-portal-tecnicos',
  templateUrl: './portal-tecnicos.page.html',
  styleUrls: ['./portal-tecnicos.page.scss'],
  standalone: false
})
export class PortalTecnicosPage implements OnInit {
  multas: any[] = [];
  loading = true;
  error: string | null = null;
  gthService: any;
  logoutService: any;

  constructor( private ApiServicio: APIService,
               private toastController: ToastController
   ) { }

  ngOnInit() {
    this.cargarMultas();
  }

  logout(): void {
    this.logoutService.logout();
  }

    irAHome() {
    this.gthService.goToHome();
  }

    async verificarMultasImpagas() {
    // Busca si hay alguna multa impaga (ajusta el valor según tu API: 'pendiente', 'impaga', etc.)
    const tieneImpagas = this.multas.some(
      multa => multa.EstadoPago && multa.EstadoPago.toLowerCase() === 'pendiente'
    );
    if (tieneImpagas) {
      const toast = await this.toastController.create({
        message: 'Tienes multas pendientes de pago.',
        color: 'warning',
        duration: 5000,
        position: 'top',
        buttons: [
          {
            text: 'Ver',
            handler: () => {
              // Puedes enfocar la lista o hacer scroll si lo deseas
            }
          }
        ]
      });
      toast.present();
    }
  }


 cargarMultas() {
    this.loading = true;
    this.error = null;
    
    this.ApiServicio.getMisMultas().subscribe({
      next: (data) => {
        this.multas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar multas. Intente nuevamente.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  
}