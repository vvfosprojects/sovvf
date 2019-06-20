import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezioneTipiTerrenoComponent } from './selezione-tipi-terreno.component';

describe('SelezioneTipiTerrenoComponent', () => {
  let component: SelezioneTipiTerrenoComponent;
  let fixture: ComponentFixture<SelezioneTipiTerrenoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelezioneTipiTerrenoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezioneTipiTerrenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
