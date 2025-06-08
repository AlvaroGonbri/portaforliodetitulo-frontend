import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialMovimientosPage } from './historial-movimientos.page';

describe('HistorialMovimientosPage', () => {
  let component: HistorialMovimientosPage;
  let fixture: ComponentFixture<HistorialMovimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
