import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

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

  apiUrl = 'http://localhost:3000/api/vigilante/register';

  constructor(private navCtrl: NavController, private http: HttpClient) {}

  register() {
    const vigilanteData = {
      nombre: this.nombre,
      clave: this.clave,
      contrasena: this.contrasena,
      acceso: this.acceso
    };

    this.http.post(this.apiUrl, vigilanteData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        alert('Vigilante registrado correctamente');
        
        setTimeout(() => {
          this.navCtrl.navigateBack('/admin');
        }, 500);
      },
      (error) => {
        console.error('Error en el registro:', error);
        alert(error.error?.message || 'Error en el registro');
      }
    );
  }

  goBack() {
    this.navCtrl.navigateBack('/home-admin');
  }
}