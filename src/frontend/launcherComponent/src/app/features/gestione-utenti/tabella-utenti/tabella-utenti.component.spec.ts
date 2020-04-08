import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaUtentiComponent } from './tabella-utenti.component';

describe('TabellaUtentiComponent', () => {
  let component: TabellaUtentiComponent;
  let fixture: ComponentFixture<TabellaUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabellaUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabellaUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
