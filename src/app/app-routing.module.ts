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
  {
    path: 'historial-movimientos',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./Pages/historial-movimientos/historial-movimientos.module').then( m => m.HistorialMovimientosPageModule)
  },
  {
    path: 'asignaciones',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./Pages/asignaciones/asignaciones.module').then( m => m.AsignacionesPageModule)
  },
  {
    path: 'multas',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./Pages/multas/multas.module').then( m => m.MultasPageModule)
  },
  {
    path: 'portal-tecnicos',
       canActivate: [RoleGuard],
    data: { roles: ['tecnicos'] },
    loadChildren: () => import('./Pages/portal-tecnicos/portal-tecnicos.module').then( m => m.PortalTecnicosPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
