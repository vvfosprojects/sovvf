import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroButtonComponent } from './centro-button.component';

describe('CentroButtonComponent', () => {
  let component: CentroButtonComponent;
  let fixture: ComponentFixture<CentroButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
