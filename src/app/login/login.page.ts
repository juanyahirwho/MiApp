import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Importante: declarar standalone
  imports: [CommonModule, FormsModule, IonicModule], // ✅ Importar módulos necesarios
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  matricula: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    console.log('Matrícula:', this.matricula, 'Contraseña:', this.password);
    this.navCtrl.navigateRoot('/home'); // Redirigir a home después del login
  }

  goToRegister() {
    this.navCtrl.navigateForward('/registrar-estudiante'); // Redirige al formulario de registro
  }
}
