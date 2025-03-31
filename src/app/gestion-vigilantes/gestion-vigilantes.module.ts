import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionVigilantesPageRoutingModule } from './gestion-vigilantes-routing.module';

import { GestionVigilantesPage } from './gestion-vigilantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionVigilantesPageRoutingModule
  ],
  declarations: [GestionVigilantesPage]
})
export class GestionVigilantesPageModule {}
