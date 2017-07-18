import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSchedeComponent } from './lista-schede.component';

describe('ListaSchedeComponent', () => {
  let component: ListaSchedeComponent;
  let fixture: ComponentFixture<ListaSchedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaSchedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSchedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
