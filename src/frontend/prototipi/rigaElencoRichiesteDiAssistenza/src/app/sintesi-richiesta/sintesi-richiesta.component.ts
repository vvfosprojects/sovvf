import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SintesiRichiesta } from "./sintesi-richiesta.model";

@Component({
  selector: 'sintesi-richiesta',
  templateUrl: './sintesi-richiesta.component.html',
  styleUrls: ['./sintesi-richiesta.component.css']
})
export class SintesiRichiestaComponent implements OnInit {
  /**
   * Indica se la visualizzazione della richiesta si ferma al primo livello di dettaglio (false) oppure arriva al secondo (true)
   */
  private espanso: boolean = false;

  @Input() richiesta: SintesiRichiesta;
  @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * restituisce un vettore con tanti elementi quanto è la priorità dell'intervento.
   * Utile per eseguire un ngFor con i pallini.
   */
  private vettorePallini() {
    return new Array(this.richiesta.priorita);
  }

  /**
   * restituisce un vettore con tanti elementi quanti sono i buchini della priorità dell'intervento.
   * Utile per eseguire un ngFor con i buchini.
   */
  private vettoreBuchini() {
    const MAX_PRIORITA = 5;
    return new Array(MAX_PRIORITA - this.richiesta.priorita);
  }

  /**
   * Restituisce tutte le tipologie eccetto la prima
   */
  private altreTipologie() {
    return this.richiesta.tipologie
      .filter((t, i) => i != 0);
  }

  /**
   * Espande/comprime il livello di dettaglio visualizzato per la richiesta
   */
  private toggleEspanso() {
    this.espanso = !this.espanso;
  }
}
