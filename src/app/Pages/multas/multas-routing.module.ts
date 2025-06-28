import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultasPage } from './multas.page';

const routes: Routes = [
  {
    path: '',
    component: MultasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultasPageRoutingModule {}
