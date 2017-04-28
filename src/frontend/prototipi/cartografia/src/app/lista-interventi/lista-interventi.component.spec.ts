import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInterventiComponent } from './lista-interventi.component';

describe('ListaInterventiComponent', () => {
  let component: ListaInterventiComponent;
  let fixture: ComponentFixture<ListaInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
