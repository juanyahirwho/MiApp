import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrar-estudiante',
  standalone: true, // ✅ Declarar como standalone
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule], // ✅ Importar módulos necesarios
  templateUrl: './registrar-estudiante.page.html',
  styleUrls: ['./registrar-estudiante.page.scss'],
})
export class RegistrarEstudiantePage {
  nombre: string = '';
  apellidos: string = '';
  fechaNacimiento: string = '';
  unidadAcademica: string = '';
  licenciatura: string = '';
  matricula: string = '';
  password: string = '';

  apiUrl = 'http://localhost:3000/api/auth/register'; // URL de la API

  constructor(private navCtrl: NavController, private http: HttpClient) {}

  register() {
    const userData = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      fecha_nacimiento: this.fechaNacimiento,
      unidad_academica: this.unidadAcademica,
      licenciatura: this.licenciatura,
      matricula: this.matricula,
      password: this.password
    };

    this.http.post(this.apiUrl, userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso');
        this.navCtrl.navigateRoot('/login'); // Redirige al login después de registrarse
      },
      (error) => {
        console.error('Error en el registro:', error);
        alert('Error en el registro');
      }
    );
  }

  goBack() {
    this.navCtrl.navigateBack('/login'); // Regresar a la pantalla de login
  }
}
