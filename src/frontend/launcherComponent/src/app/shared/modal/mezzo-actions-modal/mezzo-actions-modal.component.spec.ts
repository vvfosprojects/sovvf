import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoActionsModalComponent } from './mezzo-actions-modal.component';

describe('MezzoActionsModalComponent', () => {
  let component: MezzoActionsModalComponent;
  let fixture: ComponentFixture<MezzoActionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoActionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
