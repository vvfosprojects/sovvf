import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbarComponent } from './filterbar.component';

describe('FilterbarComponent', () => {
  let component: FilterbarComponent;
  let fixture: ComponentFixture<FilterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
