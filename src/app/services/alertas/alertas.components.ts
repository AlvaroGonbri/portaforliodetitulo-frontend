
import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/services/alertas/alertas.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {
  alertas: any[] = [];

  constructor(private alertasService: AlertasService) { }

  ngOnInit() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.alertasService.getAlertasVencidas().subscribe(
      (data) => this.alertas = data,
      (error) => console.error('Error cargando alertas', error)
    );
  }
}
