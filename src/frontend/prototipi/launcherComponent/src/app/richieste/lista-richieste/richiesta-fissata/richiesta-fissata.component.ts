import { Component, OnInit, Input } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { transition, animate, style, state, trigger } from '@angular/animations';

@Component({
  selector: 'app-richiesta-fissata',
  templateUrl: './richiesta-fissata.component.html',
  styleUrls: ['./richiesta-fissata.component.css'],
  animations: [
    trigger('richiestaSelezionata', [
      state('selected', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('not-selected', style({
        opacity: 0,
        transform: 'scale(1.3)'
      })),
      transition('* => selected', animate('200ms ease-in')),
      transition('* => not-selected', animate('200ms ease-out'))
    ]),
  ]
})
export class RichiestaFissataComponent implements OnInit {
  @Input() richiestaFissata: SintesiRichiesta;
  @Input() richiestaFissataState: string;

  constructor() { }

  ngOnInit() {
  }

  /* NgClass Template */
  cardShadowClass(r) {
    return {
      'card-shadow-info': r.stato === 'assegnato',
      'card-shadow-success': r.stato === 'presidiato',
      'card-shadow-danger': r.stato === 'chiamata',
      'card-shadow-warning': r.stato === 'sospeso',
    };
  }
}
