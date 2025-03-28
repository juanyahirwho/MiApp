import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeVigilantePageRoutingModule } from './home-vigilante-routing.module';

import { HomeVigilantePage } from './home-vigilante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeVigilantePageRoutingModule
  ],
  declarations: [HomeVigilantePage]
})
export class HomeVigilantePageModule {}
