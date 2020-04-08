import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintesiRichiestaModalComponent } from './sintesi-richiesta-modal.component';

describe('SintesiRichiestaModalComponent', () => {
  let component: SintesiRichiestaModalComponent;
  let fixture: ComponentFixture<SintesiRichiestaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintesiRichiestaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintesiRichiestaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
