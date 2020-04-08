import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMapsComponent } from './angular-maps.component';

describe('AngularMapsComponent', () => {
  let component: AngularMapsComponent;
  let fixture: ComponentFixture<AngularMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
