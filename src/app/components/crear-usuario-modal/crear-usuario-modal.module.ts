import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearUsuarioModalComponent } from './crear-usuario-modal.component';

@NgModule({
  declarations: [CrearUsuarioModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [CrearUsuarioModalComponent]
})
export class CrearUsuarioModalModule {}
