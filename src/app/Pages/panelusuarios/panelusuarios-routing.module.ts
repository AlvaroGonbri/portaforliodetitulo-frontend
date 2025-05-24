import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelusuariosPage } from './panelusuarios.page'; 

const routes: Routes = [
  {
    path: '',
    component: PanelusuariosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelusuariosPageRoutingModule  {}
