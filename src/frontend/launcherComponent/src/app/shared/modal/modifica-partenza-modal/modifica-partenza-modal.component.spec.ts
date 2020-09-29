import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaPartenzaModalComponent } from './modifica-partenza-modal.component';

describe('ModificaPartenzaModalComponent', () => {
  let component: ModificaPartenzaModalComponent;
  let fixture: ComponentFixture<ModificaPartenzaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaPartenzaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaPartenzaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
