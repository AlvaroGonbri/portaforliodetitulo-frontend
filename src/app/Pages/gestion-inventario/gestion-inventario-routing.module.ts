import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionInventarioPage } from './gestion-inventario.page';

const routes: Routes = [
  {
    path: '',
    component: GestionInventarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionInventarioPageRoutingModule {}
