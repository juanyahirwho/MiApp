import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  matricula: string = '';
  password: string = '';
  apiUrl = 'http://localhost:3000/api/estudiante/login'; // URL del endpoint de login

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  async login() {
    if (!this.matricula || !this.password) {
      this.showAlert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    const loginData = {
      matricula: this.matricula,
      contraseña: this.password
    };

    this.http.post(this.apiUrl, loginData).subscribe(
      async (response: any) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token); // Guardar token en localStorage
        localStorage.setItem('estudiante', JSON.stringify(response.estudiante)); // Guardar datos del usuario
        this.navCtrl.navigateRoot('/home'); // Redirigir a home
      },
      async (error) => {
        console.error('Error en el login:', error);
        this.showAlert('Error', 'Matrícula o contraseña incorrecta.');
      }
    );
  }

  goToRegister() {
    this.navCtrl.navigateForward('/registrar-estudiante');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
