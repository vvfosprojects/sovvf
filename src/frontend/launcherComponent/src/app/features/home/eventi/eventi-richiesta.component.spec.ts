import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventiRichiestaComponent } from './eventi-richiesta.component';

describe('EventiRichiestaComponent', () => {
  let component: EventiRichiestaComponent;
  let fixture: ComponentFixture<EventiRichiestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventiRichiestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventiRichiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
