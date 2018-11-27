import { Component, OnInit, Input } from '@angular/core';

// Model
import { PreAccoppiato } from '../model/pre-accoppiato.model';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { CompPartenzaManagerService } from 'src/app/core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { PreAccoppiatiService } from '../service/pre-accoppiati/pre-accoppiati.service';
import { PartenzaService } from '../service/partenza/partenza.service';

@Component({
  selector: 'app-faster',
  templateUrl: './faster.component.html',
  styleUrls: ['./faster.component.css']
})
export class FasterComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  preAccoppiati: PreAccoppiato[];
  preAccoppiatiSelezionati: PreAccoppiato[] = [];

  constructor(private compPartenzaManager: CompPartenzaManagerService,
    private preAccoppiatiS: PreAccoppiatiService,
    private partenzaS: PartenzaService) {
    // Restituisce i PreAccoppiati
    this.compPartenzaManager.getPreAccoppiati().subscribe((preAccoppiati: PreAccoppiato[]) => {
      this.preAccoppiati = preAccoppiati;
    });
    // Restituisce i PreAccoppiati selezionati
    this.preAccoppiatiS.getPreAccoppiatiSelezionati().subscribe((res: any) => {
      this.preAccoppiatiSelezionati = res;
    });
  }

  ngOnInit() {
  }

  preAccoppiatoSelezionato(preAccoppiato) {
    this.preAccoppiatiS.sendPreAccoppiatoSelezionato(preAccoppiato);
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
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
      if (c.descrizione === preAccoppiato.distaccamento) {
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
