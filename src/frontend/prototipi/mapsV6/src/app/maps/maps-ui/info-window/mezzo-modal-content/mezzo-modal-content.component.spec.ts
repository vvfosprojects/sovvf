import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoModalContentComponent } from './mezzo-modal-content.component';

describe('MezzoModalContentComponent', () => {
  let component: MezzoModalContentComponent;
  let fixture: ComponentFixture<MezzoModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
