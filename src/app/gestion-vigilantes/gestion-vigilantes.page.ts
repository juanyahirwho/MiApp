import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

interface Vigilante {
  id_vigilante: number;
  nombre: string;
  clave: string;
  acceso: string;
}

@Component({
  selector: 'app-gestion-vigilantes',
  templateUrl: './gestion-vigilantes.page.html',
  styleUrls: ['./gestion-vigilantes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})
export class GestionVigilantesPage implements OnInit {
  vigilantes: Vigilante[] = [];
  filteredVigilantes: Vigilante[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalVigilantes = 0;
  searchTerm = '';

  // Variables para formulario de edición
  showForm = false;
  editingVigilante: Vigilante | null = null;
  vigilanteForm: FormGroup;

  // Variables para confirmación de eliminación
  showConfirm = false;
  vigilanteToDelete: Vigilante | null = null;

  private readonly apiUrl = 'http://localhost:3000/api/vigilante';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.vigilanteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      clave: ['', [Validators.required, Validators.maxLength(50)]],
      contrasena: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      acceso: ['Acceso 1, 24 sur (Cultura física)', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadVigilantes();
  }

  /**
   * Carga la lista de vigilantes desde el servidor
   */
  private async loadVigilantes() {
    const loading = await this.showLoading('Cargando vigilantes...');
    
    try {
      const headers = this.getAuthHeaders();
      const response = await this.http.get<any>(
        `${this.apiUrl}?page=${this.currentPage}&limit=${this.itemsPerPage}`,
        { headers }
      ).toPromise();

      this.vigilantes = response.vigilantes;
      this.filteredVigilantes = [...this.vigilantes];
      this.totalVigilantes = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      
      // Si hay término de búsqueda, aplicamos el filtro
      if (this.searchTerm) {
        this.applySearchFilter();
      }
    } catch (error: any) {
      await this.showErrorAlert('Error al cargar vigilantes', error.error?.message || 'No se pudo obtener la lista de vigilantes');
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Filtra los vigilantes según el término de búsqueda
   */
  searchVigilantes(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    this.applySearchFilter();
  }

  /**
   * Aplica el filtro de búsqueda a la lista de vigilantes
   */
  private applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredVigilantes = [...this.vigilantes];
      return;
    }

    this.filteredVigilantes = this.vigilantes.filter(v => 
      v.nombre.toLowerCase().includes(this.searchTerm) || 
      v.clave.toLowerCase().includes(this.searchTerm) ||
      v.acceso.toLowerCase().includes(this.searchTerm)
    );
  }

  /**
   * Muestra el formulario de edición para un vigilante
   */
  showEditForm(vigilante: Vigilante) {
    this.editingVigilante = vigilante;
    this.vigilanteForm.patchValue({
      nombre: vigilante.nombre,
      clave: vigilante.clave,
      contrasena: '',
      acceso: vigilante.acceso
    });
    this.showForm = true;
  }

  /**
   * Cierra el formulario de edición
   */
  closeForm() {
    this.showForm = false;
    this.editingVigilante = null;
    this.vigilanteForm.reset({
      nombre: '',
      clave: '',
      contrasena: '',
      acceso: 'Acceso 1, 24 sur (Cultura física)'
    });
  }

  /**
   * Guarda los cambios de un vigilante (edición)
   */
  async saveVigilante() {
    if (this.vigilanteForm.invalid) {
      await this.showErrorAlert('Formulario inválido', 'Por favor complete todos los campos requeridos');
      return;
    }

    if (!this.editingVigilante) return;

    const loading = await this.showLoading('Guardando cambios...');
    
    try {
      const formData = this.vigilanteForm.value;
      const headers = this.getAuthHeaders();

      await this.http.put(
        `${this.apiUrl}/${this.editingVigilante.id_vigilante}`,
        formData,
        { headers }
      ).toPromise();
      
      await this.showSuccessAlert('Vigilante actualizado correctamente');
      this.loadVigilantes();
      this.closeForm();
    } catch (error: any) {
      await this.showErrorAlert(
        'Error al actualizar',
        error.error?.message || 'No se pudo completar la operación'
      );
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Muestra el diálogo de confirmación para eliminar un vigilante
   */
  confirmDelete(vigilante: Vigilante) {
    this.vigilanteToDelete = vigilante;
    this.showConfirm = true;
  }

  /**
   * Cancela la eliminación de un vigilante
   */
  cancelDelete() {
    this.showConfirm = false;
    this.vigilanteToDelete = null;
  }

  /**
   * Elimina un vigilante confirmado
   */
  async deleteVigilante() {
    if (!this.vigilanteToDelete) return;

    const loading = await this.showLoading('Eliminando vigilante...');
    
    try {
      const headers = this.getAuthHeaders();
      await this.http.delete(
        `${this.apiUrl}/${this.vigilanteToDelete.id_vigilante}`,
        { headers }
      ).toPromise();

      await this.showSuccessAlert('Vigilante eliminado correctamente');
      this.loadVigilantes();
    } catch (error: any) {
      await this.showErrorAlert('Error al eliminar', error.error?.message || 'No se pudo eliminar el vigilante');
    } finally {
      this.cancelDelete();
      await loading.dismiss();
    }
  }

  /**
   * Navega a la página siguiente de resultados
   */
  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.loadVigilantes();
    }
  }

  /**
   * Navega a la página anterior de resultados
   */
  async previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.loadVigilantes();
    }
  }

  /**
   * Obtiene los headers de autenticación con el token JWT
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No hay token de autenticación');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Muestra un loading spinner
   */
  private async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  /**
   * Muestra un alerta de éxito
   */
  private async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Muestra un alerta de error
   */
  private async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Entendido']
    });
    await alert.present();
  }
}