import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFasterComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavFasterComponent;
  let fixture: ComponentFixture<NavFasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavFasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavFasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
