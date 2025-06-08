import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { IonButton, IonicModule, IonicRouteStrategy, IonInput } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './services/Auth-Interceptor/auth-interceptor.service';
import { CrearProductoModalComponent } from './components/crear-producto-modal/crear-producto-modal.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, CrearProductoModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
