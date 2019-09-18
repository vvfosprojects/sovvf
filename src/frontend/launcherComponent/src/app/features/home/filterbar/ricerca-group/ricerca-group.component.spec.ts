import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaGroupComponent } from './ricerca-group.component';

describe('RicercaGroupComponent', () => {
  let component: RicercaGroupComponent;
  let fixture: ComponentFixture<RicercaGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
