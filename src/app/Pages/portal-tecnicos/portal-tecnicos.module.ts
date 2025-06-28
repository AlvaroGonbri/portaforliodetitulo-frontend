import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PortalTecnicosPageRoutingModule } from './portal-tecnicos-routing.module';

import { PortalTecnicosPage } from './portal-tecnicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortalTecnicosPageRoutingModule
  ],
  declarations: [PortalTecnicosPage]
})
export class PortalTecnicosPageModule {}
