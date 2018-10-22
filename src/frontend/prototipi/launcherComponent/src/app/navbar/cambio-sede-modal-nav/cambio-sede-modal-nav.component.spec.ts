import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioSedeModalNavComponent } from './cambio-sede-modal-nav.component';

describe('MezzoModalContentComponent', () => {
  let component: CambioSedeModalNavComponent;
  let fixture: ComponentFixture<CambioSedeModalNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioSedeModalNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioSedeModalNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
