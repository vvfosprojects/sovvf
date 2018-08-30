import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAggregateComponent } from './info-aggregate.component';

describe('InfoAggregateComponent', () => {
  let component: InfoAggregateComponent;
  let fixture: ComponentFixture<InfoAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
