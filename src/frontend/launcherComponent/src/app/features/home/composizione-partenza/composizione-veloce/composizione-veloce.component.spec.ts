import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasterComponent } from './composizione-veloce.component';

describe('FasterComponent', () => {
  let component: FasterComponent;
  let fixture: ComponentFixture<FasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
