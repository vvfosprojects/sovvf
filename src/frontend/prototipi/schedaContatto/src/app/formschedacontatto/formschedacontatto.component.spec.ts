import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormschedacontattoComponent } from './formschedacontatto.component';

describe('FormschedacontattoComponent', () => {
  let component: FormschedacontattoComponent;
  let fixture: ComponentFixture<FormschedacontattoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormschedacontattoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormschedacontattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
