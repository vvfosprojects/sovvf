import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriMarkersMezziComponent } from './filtri-markers-mezzi.component';

describe('FiltriMarkersMezziComponent', () => {
  let component: FiltriMarkersMezziComponent;
  let fixture: ComponentFixture<FiltriMarkersMezziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriMarkersMezziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriMarkersMezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
