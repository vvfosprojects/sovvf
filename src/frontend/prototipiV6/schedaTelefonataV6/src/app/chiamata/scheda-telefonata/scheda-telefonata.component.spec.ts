import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaTelefonataComponent } from './scheda-telefonata.component';

describe('SchedaTelefonataComponent', () => {
  let component: SchedaTelefonataComponent;
  let fixture: ComponentFixture<SchedaTelefonataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaTelefonataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaTelefonataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
