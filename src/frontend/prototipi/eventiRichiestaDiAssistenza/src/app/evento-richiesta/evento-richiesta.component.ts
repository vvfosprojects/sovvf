import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventoRichiesta } from './evento-richiesta.model';

@Component({
  selector: 'app-evento-richiesta',
  templateUrl: './evento-richiesta.component.html',
  styleUrls: ['./evento-richiesta.component.css']
})
export class EventoRichiestaComponent implements OnInit {

  private espanso: boolean = false;
  
  @Input() eventoRichiesta: EventoRichiesta;
  @Output() mostraDettaglio: EventEmitter<EventoRichiesta> = new EventEmitter();
  
  constructor() {  }

  ngOnInit() {
  }

    /**
   * Espande/comprime il livello di dettaglio visualizzato per l'evento
   */

  private toggleEspanso(): void {
    this.espanso = !this.espanso;
  }

  private clickDettaglio(event): void {
    console.log("EventoRichiestaComponent.clickDettaglio(): ", event, this.eventoRichiesta.id);
    this.mostraDettaglio.emit(this.eventoRichiesta);
    //alert("cliccato");
    event.preventDefault();
  }  

}
