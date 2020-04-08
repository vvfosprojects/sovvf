import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRichiestaModalComponent } from './action-richiesta-modal.component';

describe('ActionRichiestaModalComponent', () => {
  let component: ActionRichiestaModalComponent;
  let fixture: ComponentFixture<ActionRichiestaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRichiestaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRichiestaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
