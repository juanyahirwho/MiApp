import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionVigilantesPage } from './gestion-vigilantes.page';

const routes: Routes = [
  {
    path: '',
    component: GestionVigilantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionVigilantesPageRoutingModule {}
