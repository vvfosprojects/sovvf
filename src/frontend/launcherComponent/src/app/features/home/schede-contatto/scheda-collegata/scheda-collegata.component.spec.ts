import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaCollegataComponent } from './scheda-collegata.component';

describe('SchedaCollegataComponent', () => {
  let component: SchedaCollegataComponent;
  let fixture: ComponentFixture<SchedaCollegataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaCollegataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaCollegataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
