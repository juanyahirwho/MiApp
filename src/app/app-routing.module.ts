import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page'; // ✅ Importamos directamente el componente standalone

const routes: Routes = [
  {
    path: '',
    component: LoginPage, // ✅ Usamos component en vez de loadComponent
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'registrar-estudiante',
    loadComponent: () => import('./registrar-estudiante/registrar-estudiante.page').then(m => m.RegistrarEstudiantePage)
  },
  {
    path: 'home-admin',
    loadComponent: () => import('./home-admin/home-admin.page').then(m => m.HomeAdminPage)
  },
  {
    path: 'home-vigilante',
    loadComponent: () => import('./home-vigilante/home-vigilante.page').then(m => m.HomeVigilantePage)
  },
  {
    path: 'registrar-vigilante',
    loadComponent: () => import('./registrar-vigilante/registrar-vigilante.page').then(m => m.RegistrarVigilantePage)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
