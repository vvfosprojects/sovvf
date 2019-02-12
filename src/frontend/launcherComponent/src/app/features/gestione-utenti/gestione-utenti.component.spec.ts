import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneUtentiComponent } from './gestione-utenti.component';

describe('GestioneUtentiComponent', () => {
  let component: GestioneUtentiComponent;
  let fixture: ComponentFixture<GestioneUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioneUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
