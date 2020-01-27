import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneUtenteModalComponent } from './gestione-utente-modal.component';

describe('AggiungiUtenteModalComponent', () => {
  let component: GestioneUtenteModalComponent;
  let fixture: ComponentFixture<GestioneUtenteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioneUtenteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneUtenteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
