import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRichiesteComponent } from './lista-richieste.component';

describe('ListaRichiesteComponent', () => {
  let component: ListaRichiesteComponent;
  let fixture: ComponentFixture<ListaRichiesteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRichiesteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRichiesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
