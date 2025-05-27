import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionInventarioPageRoutingModule } from './gestion-inventario-routing.module';

import { GestionInventarioPage } from './gestion-inventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionInventarioPageRoutingModule
  ],
  declarations: [GestionInventarioPage]
})
export class GestionInventarioPageModule {}
