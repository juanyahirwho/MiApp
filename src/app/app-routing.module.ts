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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
