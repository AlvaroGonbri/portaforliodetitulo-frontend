import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirige al login
    pathMatch: 'full'
  },
  {
    path: 'panelusuarios',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }, // Solo usuarios con rol "Admin" pueden acceder
    loadChildren: () => import('./Pages/panelusuarios/panelusuarios.module').then(m => m.PanelusuariosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion-inventario',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./Pages/gestion-inventario/gestion-inventario.module').then( m => m.GestionInventarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
