import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoActionsComponent } from './mezzo-actions.component';

describe('MezzoActionsComponent', () => {
  let component: MezzoActionsComponent;
  let fixture: ComponentFixture<MezzoActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
