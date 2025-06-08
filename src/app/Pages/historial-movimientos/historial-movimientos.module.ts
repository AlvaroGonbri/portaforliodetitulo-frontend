import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialMovimientosPageRoutingModule } from './historial-movimientos-routing.module';

import { HistorialMovimientosPage } from './historial-movimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialMovimientosPageRoutingModule
  ],
  declarations: [HistorialMovimientosPage]
})
export class HistorialMovimientosPageModule {}
