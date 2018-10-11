import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioSedeModalComponent } from './cambio-sede-modal.component';

describe('MezzoModalContentComponent', () => {
  let component: CambioSedeModalComponent;
  let fixture: ComponentFixture<CambioSedeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioSedeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioSedeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
