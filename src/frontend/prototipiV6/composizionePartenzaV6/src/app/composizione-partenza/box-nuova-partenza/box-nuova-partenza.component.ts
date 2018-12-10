import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoxPartenza } from '../model/box-partenza.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-box-nuova-partenza',
  templateUrl: './box-nuova-partenza.component.html',
  styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;
  @Input() partenza: BoxPartenza;
  @Input() partenze: BoxPartenza[];
  @Input() preAccoppiatiSelezionati: BoxPartenza[];
  @Input() idPartenzaAttuale: number;
  @Input() elimina: boolean;
  @Output() selezionato: EventEmitter<BoxPartenza> = new EventEmitter();
  @Output() eliminato: EventEmitter<BoxPartenza> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    /* console.log(this.partenza); */
  }

  partenzaSelezionata(partenza: BoxPartenza) {
    this.selezionato.emit(partenza);
  }

  eliminaPartenza(partenza: BoxPartenza) {
    this.eliminato.emit(partenza);
  }

  /* NgClass status */
  cardClasses(partenza: BoxPartenza) {
    let returnClass = '';
    if (partenza) {
      switch (partenza.mezzoComposizione.mezzo.stato) {
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
    }

    if (this.preAccoppiatiSelezionati) {
      this.preAccoppiatiSelezionati.forEach(preAcc => {
        if (preAcc === partenza) {
          switch (partenza.mezzoComposizione.mezzo.stato) {
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

    if (this.partenze[this.idPartenzaAttuale] === partenza) {
      returnClass = returnClass + ' bg-grey';
    }

    return returnClass;
  }

  competenzaClasses(preAccoppiato: BoxPartenza) {
    let returnClass = 'badge-secondary';
    let count = 0;

    if (preAccoppiato) {
      this.richiesta.competenze.forEach(c => {
        count += 1;
        if (c.descrizione === preAccoppiato.mezzoComposizione.distaccamento) {
          switch (count) {
            case 1:
              returnClass = 'badge-primary';
              break;
            case 2:
              returnClass = 'badge-info';
              break;
            case 3:
              returnClass = 'badge-secondary';
              break;

            default:
              break;
          }
        }
      });
    }
    return returnClass;
  }
}
