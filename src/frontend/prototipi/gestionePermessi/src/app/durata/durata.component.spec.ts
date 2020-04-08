import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurataComponent } from './durata.component';

describe('DurataComponent', () => {
  let component: DurataComponent;
  let fixture: ComponentFixture<DurataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DurataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
