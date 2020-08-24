import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllertaSedeModalComponent } from './allerta-sede-modal.component';

describe('AllertaSedeModalComponent', () => {
  let component: AllertaSedeModalComponent;
  let fixture: ComponentFixture<AllertaSedeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllertaSedeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllertaSedeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
