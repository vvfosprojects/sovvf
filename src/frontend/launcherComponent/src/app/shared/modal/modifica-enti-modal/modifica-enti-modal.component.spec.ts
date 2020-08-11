import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaEntiModalComponent } from './modifica-enti-modal.component';

describe('ModificaEntiModalComponent', () => {
  let component: ModificaEntiModalComponent;
  let fixture: ComponentFixture<ModificaEntiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaEntiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaEntiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
