import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxInterventiComponent } from './box-interventi.component';

describe('BoxInterventiComponent', () => {
  let component: BoxInterventiComponent;
  let fixture: ComponentFixture<BoxInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
