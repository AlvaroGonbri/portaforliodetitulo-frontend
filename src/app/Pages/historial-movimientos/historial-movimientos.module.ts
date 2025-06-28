import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HistorialMovimientosPageRoutingModule } from './historial-movimientos-routing.module';

import { HistorialMovimientosPage } from './historial-movimientos.page';
import { DetalleMovimientoComponent } from 'src/app/components/detalles-movimiento/detalle-movimiento.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    HistorialMovimientosPageRoutingModule
  ],
  declarations: [HistorialMovimientosPage, DetalleMovimientoComponent]
})
export class HistorialMovimientosPageModule {}
