import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AsignacionesPageRoutingModule } from './asignaciones-routing.module';

// ✅ SOLO IMPORTAR AsignacionesPage, no declarar los otros componentes aquí
import { AsignacionesPage } from './asignaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AsignacionesPageRoutingModule,
    AsignacionesPage
  ]

})
export class AsignacionesPageModule { }