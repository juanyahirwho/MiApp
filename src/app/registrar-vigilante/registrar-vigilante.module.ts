import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarVigilantePageRoutingModule } from './registrar-vigilante-routing.module';

import { RegistrarVigilantePage } from './registrar-vigilante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarVigilantePageRoutingModule
  ],
  declarations: [RegistrarVigilantePage]
})
export class RegistrarVigilantePageModule {}
