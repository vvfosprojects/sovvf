import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaDuplicataModalComponent } from './richiesta-duplicata-modal.component';

describe('RichiestaDuplicataModalComponent', () => {
  let component: RichiestaDuplicataModalComponent;
  let fixture: ComponentFixture<RichiestaDuplicataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaDuplicataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaDuplicataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
