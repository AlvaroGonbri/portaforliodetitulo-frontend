import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/API/api.service';
@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.page.html',
  styleUrls: ['./historial-movimientos.page.scss'],
  standalone: false
})
export class HistorialMovimientosPage implements OnInit {
  movimientos: any[] = [];

  constructor(private apiServicio: APIService) { }

  ngOnInit() {
    this.getMovimientos()
  }

    getMovimientos() {
    this.apiServicio.getMovimientos().subscribe(data => {
      this.movimientos = data;
    });
  }  


}

