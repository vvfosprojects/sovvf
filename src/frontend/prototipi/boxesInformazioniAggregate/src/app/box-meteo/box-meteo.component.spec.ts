import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMeteoComponent } from './box-meteo.component';

describe('BoxMeteoComponent', () => {
  let component: BoxMeteoComponent;
  let fixture: ComponentFixture<BoxMeteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMeteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMeteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
