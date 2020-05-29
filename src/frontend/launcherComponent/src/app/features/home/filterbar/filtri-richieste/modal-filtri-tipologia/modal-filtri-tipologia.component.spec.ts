import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltriTipologiaComponent } from './modal-filtri-tipologia.component';

describe('ModalFiltriTipologiaComponent', () => {
  let component: ModalFiltriTipologiaComponent;
  let fixture: ComponentFixture<ModalFiltriTipologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFiltriTipologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFiltriTipologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
