import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtentiPerPaginaComponent } from './utenti-per-pagina.component';

describe('UtentiPerPaginaComponent', () => {
  let component: UtentiPerPaginaComponent;
  let fixture: ComponentFixture<UtentiPerPaginaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtentiPerPaginaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtentiPerPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
