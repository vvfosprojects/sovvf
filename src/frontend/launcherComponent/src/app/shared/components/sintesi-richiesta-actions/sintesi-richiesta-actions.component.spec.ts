import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintesiRichiestaActionsComponent } from './sintesi-richiesta-actions.component';

describe('SintesiRichiestaActionsComponent', () => {
  let component: SintesiRichiestaActionsComponent;
  let fixture: ComponentFixture<SintesiRichiestaActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintesiRichiestaActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintesiRichiestaActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
