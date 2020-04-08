import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezziInServizioComponent } from './mezzi-in-servizio..component';

describe('GestioneRisorseComponent', () => {
  let component: MezziInServizioComponent;
  let fixture: ComponentFixture<MezziInServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MezziInServizioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezziInServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
