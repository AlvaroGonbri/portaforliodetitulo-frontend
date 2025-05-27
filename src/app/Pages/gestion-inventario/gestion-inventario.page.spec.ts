import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionInventarioPage } from './gestion-inventario.page';

describe('GestionInventarioPage', () => {
  let component: GestionInventarioPage;
  let fixture: ComponentFixture<GestionInventarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInventarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
