import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatoreComponent } from './operatore.component';

describe('OperatoreComponent', () => {
  let component: OperatoreComponent;
  let fixture: ComponentFixture<OperatoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
