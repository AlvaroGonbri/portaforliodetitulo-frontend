import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionPage } from './asignacion.page';

describe('AsignacionPage', () => {
  let component: AsignacionPage;
  let fixture: ComponentFixture<AsignacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
