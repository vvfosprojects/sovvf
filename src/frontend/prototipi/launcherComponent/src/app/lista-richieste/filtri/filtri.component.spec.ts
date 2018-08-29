import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriComponent } from './filtri.component';

describe('FiltriComponent', () => {
  let component: FiltriComponent;
  let fixture: ComponentFixture<FiltriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
