import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriMezziServizioComponent } from './filtri-mezzi-servizio.component';

describe('FiltriMezziServizioComponent', () => {
  let component: FiltriMezziServizioComponent;
  let fixture: ComponentFixture<FiltriMezziServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriMezziServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriMezziServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
