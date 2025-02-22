import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarEstudiantePageRoutingModule } from './registrar-estudiante-routing.module';

import { RegistrarEstudiantePage } from './registrar-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarEstudiantePageRoutingModule
  ],
  declarations: [RegistrarEstudiantePage]
})
export class RegistrarEstudiantePageModule {}
