import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerMeteoSwitchComponent } from './marker-meteo-switch.component';

describe('MarkerMeteoSwitchComponent', () => {
  let component: MarkerMeteoSwitchComponent;
  let fixture: ComponentFixture<MarkerMeteoSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerMeteoSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerMeteoSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
