import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaContattoComponent } from './scheda-contatto.component';

describe('SchedaContattoComponent', () => {
  let component: SchedaContattoComponent;
  let fixture: ComponentFixture<SchedaContattoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaContattoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaContattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
