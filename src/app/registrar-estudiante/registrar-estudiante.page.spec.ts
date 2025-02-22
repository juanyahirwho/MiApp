import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarEstudiantePage } from './registrar-estudiante.page';

describe('RegistrarEstudiantePage', () => {
  let component: RegistrarEstudiantePage;
  let fixture: ComponentFixture<RegistrarEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
