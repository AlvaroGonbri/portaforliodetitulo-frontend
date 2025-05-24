import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PanelusuariosPage } from './panelusuarios.page'; 
import { PanelusuariosPageRoutingModule } from './panelusuarios-routing.module'; // <-- Importa el routing
import { APIService } from 'src/app/services/API/api.service';
import { CrearUsuarioModalModule } from 'src/app/components/crear-usuario-modal/crear-usuario-modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    PanelusuariosPageRoutingModule,
    CrearUsuarioModalModule
  ],
  providers: [
    APIService
  ],
  declarations: [PanelusuariosPage]
})
export class PanelusuariosPageModule {}
