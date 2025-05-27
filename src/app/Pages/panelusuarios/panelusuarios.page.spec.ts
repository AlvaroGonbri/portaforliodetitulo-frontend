import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PanelusuariosPage } from './panelusuarios.page';

describe('PanelusuariosPage', () => {
  let component: PanelusuariosPage;
  let fixture: ComponentFixture<PanelusuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelusuariosPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PanelusuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});