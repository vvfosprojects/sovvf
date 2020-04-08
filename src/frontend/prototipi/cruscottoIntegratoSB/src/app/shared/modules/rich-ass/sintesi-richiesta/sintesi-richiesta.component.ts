import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SintesiRichiesta } from "./sintesi-richiesta.model";
import { EventiRichiestaService } from '../../eventi-rich-ass/eventi-richiesta-service/eventi-richiesta.service';

import { EventoRichiesta } from '../../eventi-rich-ass/evento-richiesta/evento-richiesta.model';


@Component({
  selector: 'sintesi-richiesta',
  templateUrl: './sintesi-richiesta.component.html',
  styleUrls: ['./sintesi-richiesta.component.css']
})
export class SintesiRichiestaComponent implements OnInit {
  /**
   * Indica se la visualizzazione della richiesta si ferma al primo livello di dettaglio (false) oppure arriva al secondo (true)
   */
  espanso: boolean = false;

  elencoEventiRichiesta : EventoRichiesta[] = [];

  display: boolean = false;

  @Input() richiesta: SintesiRichiesta;
  @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();

  constructor(private eventiRichiestaService: EventiRichiestaService) { }

  ngOnInit() {

    this.eventiRichiestaService.getEventiRichiesta()
      .subscribe( eventiRichieste => {
        console.log("eventiRichiestaService: ", eventiRichieste);
        this.elencoEventiRichiesta = eventiRichieste;
      });
  }

  showDialog() {
    this.display = true;
  }

  /**
   * restituisce un vettore con tanti elementi quanto è la priorità dell'intervento.
   * Utile per eseguire un ngFor con i pallini.
   */
  vettorePallini() {
    return new Array(this.richiesta.prioritaRichiesta);
  }

  /**
   * restituisce un vettore con tanti elementi quanti sono i buchini della priorità dell'intervento.
   * Utile per eseguire un ngFor con i buchini.
   */
  vettoreBuchini() {
    const MAX_PRIORITA = 5;
    return new Array(MAX_PRIORITA - this.richiesta.prioritaRichiesta);
  }

  /**
   * Espande/comprime il livello di dettaglio visualizzato per la richiesta
   */
  toggleEspanso(): void {
    this.espanso = !this.espanso;
  }

  /**
   * Restituisce il vettore con i nomi delle squadre
   */
  private nomiSquadre(): string[] {
    return this.richiesta.squadre.map(s => s.nome);
  }

  /**
   * Restituisce il numero delle squadre
   */
  numeroSquadre(): number {
    return this.richiesta.squadre.length;
  }

  /**
   * Restituisce il vettore con il numero dei mezzi
   */
  numeroMezzi(): number {
    return this.richiesta.mezzi.length;
  }

  clickDettagli(): void {
    console.log("Sono il componente. Vogliono vedere i miei dettagli", this.richiesta.id);
    this.showDettagli.emit(this.richiesta);
  }
}
