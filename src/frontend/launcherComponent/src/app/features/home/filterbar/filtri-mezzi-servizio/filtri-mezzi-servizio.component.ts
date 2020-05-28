import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';

@Component({
  selector: 'app-filtri-mezzi-servizio',
  templateUrl: './filtri-mezzi-servizio.component.html',
  styleUrls: ['./filtri-mezzi-servizio.component.css']
})
export class FiltriMezziServizioComponent {

  @HostBinding('class') classes = 'input-group-append';

  @Input() filtri: VoceFiltro[];
  @Input() filtriSelezionati: VoceFiltro[];

  @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtriReset: EventEmitter<any> = new EventEmitter();

  StatoMezzo = StatoMezzo;

  constructor() {
  }

  onSelezioneFiltro(filtro: VoceFiltro) {
    console.log('filtriSelezionati', this.filtriSelezionati);
    this.filtroSelezionato.emit(filtro);
  }

  eliminaFiltriAttivi() {
    this.filtriReset.emit();
  }
}
