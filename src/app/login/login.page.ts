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
  estudianteApiUrl = 'http://localhost:3000/api/estudiante/login';
  adminApiUrl = 'http://localhost:3000/api/administrador/login';
  vigilanteApiUrl = 'http://localhost:3000/api/vigilante/login';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      this.showAlert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    // Determinar tipo de usuario
    if (this.isMatricula(this.username)) {
      this.loginEstudiante();
    } else if (this.isAdminEmail(this.username)) {
      this.loginAdmin();
    } else if (this.isClaveVigilante(this.username)) {
      this.loginVigilante();
    } else {
      this.showAlert('Error', 'Credenciales no válidas. Use matrícula (9 dígitos), clave de vigilante (10 dígitos) o correo @admin.buap.mx');
    }
  }

  private isMatricula(input: string): boolean {
    return /^\d{9}$/.test(input);
  }

  private isAdminEmail(input: string): boolean {
    return input.endsWith('@admin.buap.mx');
  }

  private isClaveVigilante(input: string): boolean {
    // Clave de vigilante de 10 dígitos numéricos
    return /^\d{10}$/.test(input);
  }

  private loginEstudiante() {
    const loginData = {
      matricula: this.username,
      contraseña: this.password
    };

    this.http.post(this.estudianteApiUrl, loginData).subscribe(
      async (response: any) => {
        console.log('Login exitoso (estudiante):', response);
        this.saveSessionData(response.token, response.estudiante, 'estudiante');
        this.navCtrl.navigateRoot('/home');
      },
      async (error) => {
        console.error('Error en el login (estudiante):', error);
        this.showAlert('Error', 'Matrícula o contraseña incorrecta.');
      }
    );
  }

  private loginAdmin() {
    const loginData = {
      correo: this.username,
      contraseña: this.password
    };

    this.http.post(this.adminApiUrl, loginData).subscribe(
      async (response: any) => {
        console.log('Login exitoso (admin):', response);
        this.saveSessionData(response.token, response.administrador, 'admin');
        this.navCtrl.navigateRoot('/home-admin');
      },
      async (error) => {
        console.error('Error en el login (admin):', error);
        this.showAlert('Error', 'Correo o contraseña incorrecta.');
      }
    );
  }

  private loginVigilante() {
    const loginData = {
      clave: this.username,
      contraseña: this.password
    };

    this.http.post(this.vigilanteApiUrl, loginData).subscribe(
      async (response: any) => {
        console.log('Login exitoso (vigilante):', response);
        this.saveSessionData(response.token, response.vigilante, 'vigilante');
        this.navCtrl.navigateRoot('/home-vigilante'); // Asegúrate de tener esta ruta configurada
      },
      async (error) => {
        console.error('Error en el login (vigilante):', error);
        this.showAlert('Error', 'Clave o contraseña incorrecta.');
      }
    );
  }

  private saveSessionData(token: string, userData: any, userType: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
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