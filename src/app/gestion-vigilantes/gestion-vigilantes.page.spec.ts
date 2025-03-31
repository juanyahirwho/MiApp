import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionVigilantesPage } from './gestion-vigilantes.page';

describe('GestionVigilantesPage', () => {
  let component: GestionVigilantesPage;
  let fixture: ComponentFixture<GestionVigilantesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionVigilantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
