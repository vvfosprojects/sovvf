import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSchedeContattoComponent } from './lista-schede-contatto.component';

describe('ListaSchedeContattoComponent', () => {
  let component: ListaSchedeContattoComponent;
  let fixture: ComponentFixture<ListaSchedeContattoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSchedeContattoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSchedeContattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
