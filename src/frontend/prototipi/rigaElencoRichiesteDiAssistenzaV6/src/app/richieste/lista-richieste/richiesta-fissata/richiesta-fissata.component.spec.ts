import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaFissataComponent } from './richiesta-fissata.component';

describe('RichiestaSelezionataComponent', () => {
  let component: RichiestaFissataComponent;
  let fixture: ComponentFixture<RichiestaFissataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaFissataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaFissataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
