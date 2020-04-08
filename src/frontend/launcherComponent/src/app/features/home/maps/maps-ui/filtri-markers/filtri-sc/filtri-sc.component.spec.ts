import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriScComponent } from './filtri-sc.component';

describe('FiltriScComponent', () => {
  let component: FiltriScComponent;
  let fixture: ComponentFixture<FiltriScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriScComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
