import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarVigilantePage } from './registrar-vigilante.page';

describe('RegistrarVigilantePage', () => {
  let component: RegistrarVigilantePage;
  let fixture: ComponentFixture<RegistrarVigilantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarVigilantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
