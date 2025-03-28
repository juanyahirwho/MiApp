import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeVigilantePage } from './home-vigilante.page';

describe('HomeVigilantePage', () => {
  let component: HomeVigilantePage;
  let fixture: ComponentFixture<HomeVigilantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVigilantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
