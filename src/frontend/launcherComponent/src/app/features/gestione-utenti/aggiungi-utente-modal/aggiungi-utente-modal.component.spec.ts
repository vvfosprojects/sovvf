import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiUtenteModalComponent } from './aggiungi-utente-modal.component';

describe('AggiungiUtenteModalComponent', () => {
  let component: AggiungiUtenteModalComponent;
  let fixture: ComponentFixture<AggiungiUtenteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggiungiUtenteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiUtenteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
