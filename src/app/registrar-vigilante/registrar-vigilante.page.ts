import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registrar-vigilante',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './registrar-vigilante.page.html',
  styleUrls: ['./registrar-vigilante.page.scss'],
})
export class RegistrarVigilantePage {
  nombre: string = '';
  clave: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  acceso: string = '';

  accesos = [
    'Acceso 1, 24 sur (Cultura física)',
    'Acceso 3, 18 sur (Ciencias Químicas)',
    'Acceso 4, 14 sur y San Claudio (Ciencias de la computación)',
    'Acceso 5, 14 sur (Ciencias de la computación)',
    'Acceso 6, Blvd. Carlos Camacho (Arquitectura)',
    'Acceso 7, Blvd. Carlos Camacho (Arena Universitaria)',
    'Acceso 8, Blvd. Carlos Camacho (Contaduría)',
    'Acceso 9, Blvd. Carlos Camacho (Multiaulas)',
    'Acceso 10, Blvd. Carlos Camacho (Biblioteca Central)',
    'Acceso 11, Blvd. Municipio libre (Seminarios)'
  ];

  private apiUrl = 'http://localhost:3000/api/vigilante/register';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  async register() {
    if (!this.nombre || !this.clave || !this.contrasena || !this.acceso) {
      await this.showAlert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const vigilanteData = {
      nombre: this.nombre,
      clave: this.clave,
      contrasena: this.contrasena,
      acceso: this.acceso
    };

    try {
      const response: any = await this.http.post(this.apiUrl, vigilanteData).toPromise();
      console.log('Registro exitoso:', response);
      await this.showAlert('Éxito', 'Vigilante registrado correctamente');
      this.navCtrl.navigateBack('/home-admin');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      const errorMessage = error.error?.message || 'Error en el registro';
      await this.showAlert('Error', errorMessage);
    }
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