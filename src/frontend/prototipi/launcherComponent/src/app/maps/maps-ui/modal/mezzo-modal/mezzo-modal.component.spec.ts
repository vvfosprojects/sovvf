import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoModalComponent } from './mezzo-modal.component';

describe('MezzoModalComponent', () => {
  let component: MezzoModalComponent;
  let fixture: ComponentFixture<MezzoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
