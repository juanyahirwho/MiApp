import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registrar-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './registrar-estudiante.page.html',
  styleUrls: ['./registrar-estudiante.page.scss'],
})
export class RegistrarEstudiantePage {
  // Variables del formulario
  nombre: string = '';
  correoPersonal: string = '';
  correoInstitucional: string = '';
  facultad: string = '';
  matricula: string = '';
  telefono: string = '';
  fotoPerfil: string = ''; // Añadida esta propiedad
  contrasena: string = '';
  confirmarContrasena: string = '';

  // URL de la API
  private apiUrl = 'http://localhost:3000/api/estudiante/register';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  // Método para volver atrás
  goBack() {
    this.navCtrl.navigateRoot('/');
  }

  async register() {
    // Validaciones básicas
    if (!this.nombre || !this.correoPersonal || !this.correoInstitucional || 
        !this.contrasena || !this.facultad || !this.matricula) {
      await this.showAlert('Error', 'Todos los campos obligatorios deben estar llenos');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const estudianteData = {
      nombre: this.nombre,
      correo_personal: this.correoPersonal,
      correo_institucional: this.correoInstitucional,
      contrasena: this.contrasena,
      facultad: this.facultad,
      matricula: this.matricula,
      telefono: this.telefono || null,
      foto_perfil: this.fotoPerfil || null
    };

    try {
      const response: any = await this.http.post(this.apiUrl, estudianteData).toPromise();
      console.log('Registro exitoso:', response);
      await this.showAlert('Éxito', 'Estudiante registrado correctamente');
      this.navCtrl.navigateRoot('/');
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