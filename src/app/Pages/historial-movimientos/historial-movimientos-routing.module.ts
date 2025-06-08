import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialMovimientosPage } from './historial-movimientos.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialMovimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialMovimientosPageRoutingModule {}
