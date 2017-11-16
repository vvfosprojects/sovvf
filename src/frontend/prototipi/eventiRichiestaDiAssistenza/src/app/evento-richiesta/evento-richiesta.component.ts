import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventoRichiesta } from './evento-richiesta.model';

@Component({
  selector: 'app-evento-richiesta',
  templateUrl: './evento-richiesta.component.html',
  styleUrls: ['./evento-richiesta.component.css']
})
export class EventoRichiestaComponent implements OnInit {

  private espanso: boolean = false;
  private iconaClasseEventoCorrente;
  iconeClassiEvento: any ;
  myMap: any ;
  
  @Input() eventoRichiesta: EventoRichiesta;
  @Output() mostraDettaglio: EventEmitter<EventoRichiesta> = new EventEmitter();
  
  @Input() istanteEventoPrecedente: Date;
  @Input() istantePrimoEvento: Date;
  @Input() nomeClasseEvento;


  constructor() {  }

  ngOnInit() {
        
    this.iconeClassiEvento = [
      ["telefonata","fa-phone-square"]
      ,["assegnazione_partenza","fa-truck"]
      ,["uscita_partenza","fa-rocket"]
      ,["arrivo_partenza_sul_posto","fa-check-square-o"]
      ,["fine_intervento_della_partenza","fa-handshake-o"]
      ,["rientro_in_sede_della_partenza","fa-fast-backward"]
      ,["chiusura_richiesta","fa-close"]
    ];

    this.myMap = new Map(this.iconeClassiEvento);    

    this.iconaClasseEventoCorrente = this.myMap.get(this.nomeClasseEvento);

    //this.iconaClasseEventoCorrente = myMap.get("telefonata");    
    //this.iconaClasseEventoCorrente = "fa-phone-square";
    /*
    console.log("Felix start"); 
    console.log(this.nomeClasseEvento); 
    console.log(Array.from(this.myMap));
    console.log(this.myMap.get(this.nomeClasseEvento));
    console.log(this.myMap.get("telefonata"));
    console.log(this.iconaClasseEventoCorrente); 
    */
 
 
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
