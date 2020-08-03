import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VociRubricaPerPaginaComponent } from './voci-rubrica-per-pagina.component';

describe('VociRubricaPerPaginaComponent', () => {
  let component: VociRubricaPerPaginaComponent;
  let fixture: ComponentFixture<VociRubricaPerPaginaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VociRubricaPerPaginaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VociRubricaPerPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
