import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkStateComponent } from './link-state.component';

describe('LinkStateComponent', () => {
  let component: LinkStateComponent;
  let fixture: ComponentFixture<LinkStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
