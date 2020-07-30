import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoceRubricaModalComponent } from './add-voce-rubrica-modal.component';

describe('AddVoceRubricaModalComponent', () => {
  let component: AddVoceRubricaModalComponent;
  let fixture: ComponentFixture<AddVoceRubricaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVoceRubricaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVoceRubricaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
