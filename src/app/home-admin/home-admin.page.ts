import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';

interface AppCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':hover', [
        animate('150ms ease-in', style({ transform: 'scale(1.03)' }))
      ])
    ])
  ]
})
export class HomeAdminPage {
  activeGuards = 8;
  todayVehicles = 24;

  cards: AppCard[] = [
    {
      title: 'Vigilantes',
      description: 'Visualiza y gestiona el personal de vigilancia',
      icon: 'people-circle-outline',
      route: 'vigilantes'
    },
    {
      title: 'Vehículos',
      description: 'Consulta los vehículos actualmente en el campus',
      icon: 'car-sport-outline',
      route: 'vehiculos'
    },
    {
      title: 'Historial',
      description: 'Registro completo de ingresos y salidas',
      icon: 'time-outline',
      route: 'historial'
    },
    {
      title: 'Nuevo Vigilante',
      description: 'Añade nuevos miembros al equipo de seguridad',
      icon: 'person-add-outline',
      route: 'registrar-vigilante' 
    }
  ];

  constructor(private navCtrl: NavController) {}

  /**
   * Navega a la página especificada
   * @param page Ruta de destino
   */
  navigateTo(page: string): void {
    // Verifica si es la ruta de registro de vigilante
    if (page === 'registrar-vigilante') {
      this.navCtrl.navigateForward('/registrar-vigilante', {
        animationDirection: 'forward',
        state: { isAdmin: true }  // Puedes enviar datos adicionales si es necesario
      });
    } else {
      this.navCtrl.navigateForward(`/admin/${page}`);
    }
  }

  /**
   * Cierra la sesión actual y redirige al login
   */
  logout(): void {
    // Limpiar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    
    // Redirigir al login
    this.navCtrl.navigateRoot('/');
  }

  /**
   * Actualiza las estadísticas (ejemplo)
   */
  refreshStats(): void {
    // Aquí iría la lógica para actualizar los datos
    console.log('Actualizando estadísticas...');
    // Ejemplo de actualización:
    this.activeGuards = Math.floor(Math.random() * 10) + 5;
    this.todayVehicles = Math.floor(Math.random() * 30) + 15;
  }
}