import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaUtentiComponent } from './ricerca-utenti.component';

describe('RicercaUtentiComponent', () => {
  let component: RicercaUtentiComponent;
  let fixture: ComponentFixture<RicercaUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
