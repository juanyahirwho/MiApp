import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarEstudiantePage } from './registrar-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarEstudiantePageRoutingModule {}
