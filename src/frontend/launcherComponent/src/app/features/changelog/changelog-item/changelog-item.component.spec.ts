import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogItemComponent } from './changelog-item.component';

describe('ChangelogItemComponent', () => {
  let component: ChangelogItemComponent;
  let fixture: ComponentFixture<ChangelogItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangelogItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
