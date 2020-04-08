import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMezziComponent } from './box-mezzi.component';

describe('BoxMezziComponent', () => {
  let component: BoxMezziComponent;
  let fixture: ComponentFixture<BoxMezziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMezziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
