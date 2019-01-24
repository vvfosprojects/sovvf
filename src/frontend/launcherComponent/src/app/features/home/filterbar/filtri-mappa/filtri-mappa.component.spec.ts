import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriMappaComponent } from './filtri-mappa.component';

describe('FiltriMappaComponent', () => {
  let component: FiltriMappaComponent;
  let fixture: ComponentFixture<FiltriMappaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriMappaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriMappaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
