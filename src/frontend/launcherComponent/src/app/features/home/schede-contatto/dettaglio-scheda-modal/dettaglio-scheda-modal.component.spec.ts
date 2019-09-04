import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioSchedaModalComponent } from './dettaglio-scheda-modal.component';

describe('DettaglioSchedaModalComponent', () => {
  let component: DettaglioSchedaModalComponent;
  let fixture: ComponentFixture<DettaglioSchedaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioSchedaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioSchedaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
