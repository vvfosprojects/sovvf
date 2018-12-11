import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalServiziComponent } from './modal-servizi.component';

describe('ModalServiziComponent', () => {
  let component: ModalServiziComponent;
  let fixture: ComponentFixture<ModalServiziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalServiziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalServiziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
