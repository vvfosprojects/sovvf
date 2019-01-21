import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { BoxPartenza } from '../../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-box-nuova-partenza',
  templateUrl: './box-nuova-partenza.component.html',
  styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent implements OnInit {
  @Input() partenza: BoxPartenza;
  @Output() selezionato = new EventEmitter<BoxPartenza>();
  @Output() deselezionato = new EventEmitter<BoxPartenza>();
  @Output() eliminato = new EventEmitter<BoxPartenza>();

  @Input() richiesta: SintesiRichiesta;
  @Input() compPartenzaMode: string;

  // Options
  @Input() elimina: boolean;
  @Input() alert: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onHoverIn() {
  }

  onHoverOut() {
  }

  onClick() {
    if (!this.partenza.selezionato) {
      this.selezionato.emit(this.partenza);
    } else {
      this.deselezionato.emit(this.partenza);
    }
  }

  onElimina() {
    this.eliminato.emit(this.partenza);
  }

  ngClass() {
    let returnClass: any;

    if (this.compPartenzaMode === 'faster') {
      /* Se è attiva la modalità rapida */
      returnClass = {
        'card-shadow': !this.partenza.selezionato,
        'bg-light border-success card-shadow-success': this.partenza.selezionato
      };

    } else if (this.compPartenzaMode === 'slower') {
      /* Se è attiva la modalità avanzata */

      if (this.partenza.selezionato) {
        const squadra = this.partenza.squadraComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
        const mezzo = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

        returnClass = 'bg-light ';

        switch (mezzo + '|' + squadra) {
          case 'mezzo-si|squadra-no':
            returnClass += 'border-danger card-shadow-danger';
            break;
          case 'mezzo-no|squadra-no':
            returnClass = 'border-danger card-shadow-danger';
            break;
          case 'mezzo-si|squadra-si':
            returnClass = 'border-success card-shadow-success';
            break;
          case 'mezzo-no|squadra-si':
            returnClass = 'border-warning card-shadow-warning';
            break;
        }
      } else if (!this.partenza.selezionato) {
        returnClass = 'card-shadow';
      }
    }

    return returnClass;
  }

  badgeDistaccamentoClass() {
    let result = 'badge-secondary';

    if (this.richiesta && this.partenza.mezzoComposizione) {
      const distaccamentoMezzo = this.partenza.mezzoComposizione.mezzo.distaccamento.descrizione;

      if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
        result = 'badge-primary';
      } else if (this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
        result = 'badge-info';
      }
    }

    return result;
  }

  boxValidationClass() {
    let result = 'text-danger';
    let tooltip = 'Errore sconosciuto';
    const prefix = 'fa ';
    let icon = 'fa-exclamation-triangle';
    const squadra2 = this.partenza.squadraComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
    const mezzo2 = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

    switch (mezzo2 + '|' + squadra2) {
      case 'mezzo-si|squadra-no':
        tooltip = 'È necessario selezionare una squadra';
        break;
      case 'mezzo-no|squadra-no':
        tooltip = 'È necessario selezionare un mezzo o una squadra';
        break;
      case 'mezzo-si|squadra-si':
        result = 'text-success';
        tooltip = 'Tutto ok';
        icon = 'fa-check';
        break;
      case 'mezzo-no|squadra-si':
        result = 'text-warning';
        tooltip = 'Stai inserendo una partenza senza mezzo';
        break;
    }

    return { result: result + ' ' + prefix + icon, tooltip: tooltip };
  }
}
