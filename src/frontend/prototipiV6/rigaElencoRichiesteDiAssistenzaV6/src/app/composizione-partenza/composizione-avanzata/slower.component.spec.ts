import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowerComponent } from './slower.component';

describe('SlowerComponent', () => {
  let component: SlowerComponent;
  let fixture: ComponentFixture<SlowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
