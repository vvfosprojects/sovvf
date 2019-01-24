import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintesiRichiestaSmComponent } from './sintesi-richiesta-sm.component';

describe('SintesiRichiestaSmComponent', () => {
  let component: SintesiRichiestaSmComponent;
  let fixture: ComponentFixture<SintesiRichiestaSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintesiRichiestaSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintesiRichiestaSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
