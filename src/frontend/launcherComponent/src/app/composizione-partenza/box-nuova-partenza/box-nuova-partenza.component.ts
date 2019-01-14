import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BoxPartenza } from '../interface/box-partenza-interface';

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

  // Options
  @Input() elimina: boolean;

  constructor() {
  }

  ngOnInit() {
    // TEST
    // console.log('[BoxPartenza] Partenza', this.partenza);
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

  NgClass() {
    return {
      'card-shadow': !this.partenza.selezionato,
      'bg-light border-danger card-shadow-danger': this.partenza.selezionato
    };
  }

  BoxValidationClass() {
    let result = 'text-danger';
    let tooltip = 'Errore sconosciuto';
    const prefix = 'fa ';
    let icon = 'fa-exclamation-triangle';
    const squadra = this.partenza.squadraComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
    const mezzo = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

    switch (mezzo + '|' + squadra) {
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
