import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRowComponent } from './chat-row.component';

describe('ChatRowComponent', () => {
  let component: ChatRowComponent;
  let fixture: ComponentFixture<ChatRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
