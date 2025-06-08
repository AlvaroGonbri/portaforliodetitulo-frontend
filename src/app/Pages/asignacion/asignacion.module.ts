import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignacionPageRoutingModule } from './asignacion-routing.module';

import { AsignacionPage } from './asignacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignacionPageRoutingModule
  ],
  declarations: [AsignacionPage]
})
export class AsignacionPageModule {}
