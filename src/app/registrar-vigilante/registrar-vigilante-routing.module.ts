import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarVigilantePage } from './registrar-vigilante.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarVigilantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarVigilantePageRoutingModule {}
