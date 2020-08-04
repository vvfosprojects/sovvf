import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoceRubricaModalComponent } from './voce-rubrica-modal.component';

describe('AddVoceRubricaModalComponent', () => {
  let component: VoceRubricaModalComponent;
  let fixture: ComponentFixture<VoceRubricaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoceRubricaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoceRubricaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
