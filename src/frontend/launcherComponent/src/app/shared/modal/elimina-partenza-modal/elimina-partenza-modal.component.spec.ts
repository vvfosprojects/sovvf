import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminaPartenzaModalComponent } from './elimina-partenza-modal.component';

describe('EliminaPartenzaModalComponent', () => {
  let component: EliminaPartenzaModalComponent;
  let fixture: ComponentFixture<EliminaPartenzaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminaPartenzaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminaPartenzaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
