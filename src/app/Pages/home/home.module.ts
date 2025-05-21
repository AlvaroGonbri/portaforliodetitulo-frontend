import { importProvidersFrom, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HomePageRoutingModule } from './home-routing.module';
import { APIService } from 'src/app/services/api.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule
  ],

  providers : [
    APIService
  ],

  declarations: [HomePage]
})
export class HomePageModule {}
