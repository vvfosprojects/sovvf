import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreAccoppiato } from '../model/pre-accoppiato.model';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-preaccoppiato',
  templateUrl: './preaccoppiato.component.html',
  styleUrls: ['./preaccoppiato.component.css']
})
export class PreaccoppiatoComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;
  @Input() preAcc: PreAccoppiato;
  @Input() preAccoppiatiSelezionati: PreAccoppiato[];
  @Output() selezionato: EventEmitter<PreAccoppiato> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  preAccoppiatoSelezionato(preAcc: PreAccoppiato){
    this.selezionato.emit(preAcc);
  }

  /* NgClass status */
  cardClasses(preAccoppiato: PreAccoppiato) {
    let returnClass = '';
    switch (preAccoppiato.mezzo.stato) {
      case 'inSede':
        returnClass = 'status_inSede card-shadow';
        break;
      case 'inRientro':
        returnClass = 'status_inRientro card-shadow';
        break;
      case 'inViaggio':
        returnClass = 'status_inViaggio card-shadow';
        break;
      case 'sulPosto':
        returnClass = 'status_sulPosto card-shadow';
        break;
      default:
        break;
    }

    if (this.preAccoppiatiSelezionati) {
      this.preAccoppiatiSelezionati.forEach(preAcc => {
        if (preAcc === preAccoppiato) {
          switch (preAccoppiato.mezzo.stato) {
            case 'inSede':
              returnClass = 'status_inSede bg-light card-shadow-secondary-soft';
              break;
            case 'inRientro':
              returnClass = 'status_inRientro bg-light card-shadow-primary-soft';
              break;
            case 'inViaggio':
              returnClass = 'status_inViaggio bg-light card-shadow-info-soft';
              break;
            case 'sulPosto':
              returnClass = 'status_sulPosto bg-light card-shadow-success-soft';
              break;
            default:
              break;
          }
        }
      });
    }
    return returnClass;
  }

  compotenzaClasses(preAccoppiato: PreAccoppiato) {
    let returnClass = '';
    let count = 0;

    this.richiesta.competenze.forEach(c => {
      count += 1;
      if (c.codice === preAccoppiato.distaccamento.codice) {
        switch (count) {
          case 1:
            returnClass = 'badge-primary'
            break;
          case 2:
            returnClass = 'badge-info'
            break;
          case 3:
            returnClass = 'badge-secondary'
            break;

          default:
            break;
        }
      }
    })
    return returnClass;
  }
}
