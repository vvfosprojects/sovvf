import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreaccoppiatoComponent } from './preaccoppiato.component';

describe('PreaccoppiatoComponent', () => {
  let component: PreaccoppiatoComponent;
  let fixture: ComponentFixture<PreaccoppiatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreaccoppiatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreaccoppiatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
