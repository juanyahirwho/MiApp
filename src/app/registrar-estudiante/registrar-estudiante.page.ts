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
  correoPersonal: string = '';
  correoInstitucional: string = '';
  facultad: string = '';
  matricula: string = '';
  telefono: string = '';
  fotoPerfil: string = '';
  contrasena: string = '';

  apiUrl = 'http://localhost:3000/api/estudiante/register';


  constructor(private navCtrl: NavController, private http: HttpClient) {}

  register() {
    const userData = {
      nombre: this.nombre,
      correo_personal: this.correoPersonal,
      correo_institucional: this.correoInstitucional,
      contrasena: this.contrasena,
      facultad: this.facultad,
      matricula: this.matricula,
      telefono: this.telefono || null,
      foto_perfil: this.fotoPerfil || null
    };
  
    this.http.post(this.apiUrl, userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso');
  
        // 🔹 Esperar un breve momento antes de redirigir
        setTimeout(() => {
          this.navCtrl.navigateRoot('/'); // Asegurar que regrese al login
        }, 500); 
      },
      (error) => {
        console.error('Error en el registro:', error);
        alert('Error en el registro');
      }
    );
  }
    
  goBack() {
    this.navCtrl.navigateRoot('/'); // 🔹 Asegurar que regrese al login
  }
  
  
}
