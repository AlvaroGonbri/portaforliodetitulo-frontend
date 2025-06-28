import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultasPageRoutingModule } from './multas-routing.module';

import { MultasPage } from './multas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultasPageRoutingModule
  ],
  declarations: [MultasPage]
})
export class MultasPageModule {}
