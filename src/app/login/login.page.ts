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
  username: string = '';
  password: string = '';

  private estudianteApiUrl = 'http://localhost:3000/api/estudiante/login';
  private adminApiUrl = 'http://localhost:3000/api/administrador/login';
  private vigilanteApiUrl = 'http://localhost:3000/api/vigilante/login';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  // Método para redirigir al registro
  goToRegister() {
    this.navCtrl.navigateForward('/registrar-estudiante');
  }

  async login() {
    if (!this.username || !this.password) {
      await this.showAlert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    try {
      if (this.isMatricula(this.username)) {
        await this.loginEstudiante();
      } else if (this.isAdminEmail(this.username)) {
        await this.loginAdmin();
      } else if (this.isClaveVigilante(this.username)) {
        await this.loginVigilante();
      } else {
        await this.showAlert('Error', 'Credenciales no válidas. Use matrícula (9 dígitos), clave de vigilante (10 dígitos) o correo @admin.buap.mx');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      await this.showAlert('Error', 'Ocurrió un error durante el login');
    }
  }

  private isMatricula(input: string): boolean {
    return /^\d{9}$/.test(input);
  }

  private isAdminEmail(input: string): boolean {
    return input.endsWith('@admin.buap.mx');
  }

  private isClaveVigilante(input: string): boolean {
    return /^\d{10}$/.test(input);
  }

  private async loginEstudiante() {
    const loginData = {
      matricula: this.username,
      contrasena: this.password
    };

    const response: any = await this.http.post(this.estudianteApiUrl, loginData).toPromise();
    this.handleLoginResponse(response, 'estudiante', '/home');
  }

  private async loginAdmin() {
    const loginData = {
      correo: this.username,
      contrasena: this.password
    };

    const response: any = await this.http.post(this.adminApiUrl, loginData).toPromise();
    this.handleLoginResponse(response, 'admin', '/home-admin');
  }

  private async loginVigilante() {
    const loginData = {
      clave: this.username,
      contrasena: this.password
    };

    const response: any = await this.http.post(this.vigilanteApiUrl, loginData).toPromise();
    this.handleLoginResponse(response, 'vigilante', '/home-vigilante');
  }

  private handleLoginResponse(response: any, userType: string, route: string) {
    console.log(`Login exitoso (${userType}):`, response);
    this.saveSessionData(response.token, response[userType], userType);
    this.navCtrl.navigateRoot(route);
  }

  private saveSessionData(token: string, userData: any, userType: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}