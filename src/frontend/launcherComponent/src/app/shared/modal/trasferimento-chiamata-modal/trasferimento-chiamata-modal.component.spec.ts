import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferimentoChiamataModalComponent } from './trasferimento-chiamata-modal.component';

describe('TrasferimentoChiamataModalComponent', () => {
  let component: TrasferimentoChiamataModalComponent;
  let fixture: ComponentFixture<TrasferimentoChiamataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasferimentoChiamataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasferimentoChiamataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
