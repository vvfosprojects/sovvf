import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificheComponent } from './notifiche.component';

describe('NotificheComponent', () => {
  let component: NotificheComponent;
  let fixture: ComponentFixture<NotificheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
