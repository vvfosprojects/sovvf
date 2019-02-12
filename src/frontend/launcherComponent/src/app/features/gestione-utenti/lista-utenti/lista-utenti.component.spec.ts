import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUtentiComponent } from './lista-utenti.component';

describe('ListaUtentiComponent', () => {
  let component: ListaUtentiComponent;
  let fixture: ComponentFixture<ListaUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
