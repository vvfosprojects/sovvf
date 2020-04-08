import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPartenzeComponent } from './lista-partenze.component';

describe('ListaPartenzeComponent', () => {
  let component: ListaPartenzeComponent;
  let fixture: ComponentFixture<ListaPartenzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPartenzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPartenzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
