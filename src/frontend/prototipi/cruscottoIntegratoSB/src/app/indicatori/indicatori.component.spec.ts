import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatoriComponent } from './indicatori.component';

describe('IndicatoriComponent', () => {
  let component: IndicatoriComponent;
  let fixture: ComponentFixture<IndicatoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
