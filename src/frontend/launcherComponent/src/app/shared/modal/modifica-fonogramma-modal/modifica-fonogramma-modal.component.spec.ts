import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaFonogrammaModalComponent } from './modifica-fonogramma-modal.component';

describe('ModificaFonogrammaModalComponent', () => {
  let component: ModificaFonogrammaModalComponent;
  let fixture: ComponentFixture<ModificaFonogrammaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaFonogrammaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaFonogrammaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
