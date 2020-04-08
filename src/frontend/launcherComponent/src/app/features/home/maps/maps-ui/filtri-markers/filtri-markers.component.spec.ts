import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriMarkersComponent } from './filtri-markers.component';

describe('FiltriMarkersComponent', () => {
  let component: FiltriMarkersComponent;
  let fixture: ComponentFixture<FiltriMarkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriMarkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
