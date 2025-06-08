import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignacionPage } from './asignacion.page';

const routes: Routes = [
  {
    path: '',
    component: AsignacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionPageRoutingModule {}
