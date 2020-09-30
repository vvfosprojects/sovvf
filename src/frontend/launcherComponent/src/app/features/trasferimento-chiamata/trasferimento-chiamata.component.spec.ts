import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferimentoChiamataComponent } from './trasferimento-chiamata.component';

describe('TrasferimentoChiamataComponent', () => {
  let component: TrasferimentoChiamataComponent;
  let fixture: ComponentFixture<TrasferimentoChiamataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasferimentoChiamataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasferimentoChiamataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
