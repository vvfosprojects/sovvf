import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteModalComponent } from './ente-modal.component';

describe('AddVoceRubricaModalComponent', () => {
  let component: EnteModalComponent;
  let fixture: ComponentFixture<EnteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
