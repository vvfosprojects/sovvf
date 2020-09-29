import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioFonogrammaModalComponent } from './dettaglio-fonogramma-modal.component';

describe('DettaglioFonogrammaModalComponent', () => {
  let component: DettaglioFonogrammaModalComponent;
  let fixture: ComponentFixture<DettaglioFonogrammaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioFonogrammaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioFonogrammaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
