import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaTrasferimentoChiamataComponent } from './ricerca-trasferimento-chiamata.component';

describe('RicercaTrasferimentoChiamataComponent', () => {
  let component: RicercaTrasferimentoChiamataComponent;
  let fixture: ComponentFixture<RicercaTrasferimentoChiamataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaTrasferimentoChiamataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaTrasferimentoChiamataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
