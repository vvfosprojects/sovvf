import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintesiSchedaComponent } from './sintesi-scheda.component';

describe('SintesiSchedaComponent', () => {
  let component: SintesiSchedaComponent;
  let fixture: ComponentFixture<SintesiSchedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintesiSchedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintesiSchedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
