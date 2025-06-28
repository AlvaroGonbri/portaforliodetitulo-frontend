import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalTecnicosPage } from './portal-tecnicos.page';

describe('PortalTecnicosPage', () => {
  let component: PortalTecnicosPage;
  let fixture: ComponentFixture<PortalTecnicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalTecnicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
