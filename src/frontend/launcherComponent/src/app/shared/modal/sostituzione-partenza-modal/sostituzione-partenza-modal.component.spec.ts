import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SostituzionePartenzaModalComponent } from './sostituzione-partenza-modal.component';

describe('SostituzionePartenzaComponent', () => {
  let component: SostituzionePartenzaModalComponent;
  let fixture: ComponentFixture<SostituzionePartenzaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SostituzionePartenzaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SostituzionePartenzaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
