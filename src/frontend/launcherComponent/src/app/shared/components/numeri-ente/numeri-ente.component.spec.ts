import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeriEnteComponent } from './numeri-ente.component';

describe('NumeriEnteComponent', () => {
  let component: NumeriEnteComponent;
  let fixture: ComponentFixture<NumeriEnteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeriEnteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeriEnteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
