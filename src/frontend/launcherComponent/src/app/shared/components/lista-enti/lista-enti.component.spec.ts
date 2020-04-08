import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEntiComponent } from './lista-enti.component';

describe('ListaEntiComponent', () => {
  let component: ListaEntiComponent;
  let fixture: ComponentFixture<ListaEntiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEntiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEntiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
