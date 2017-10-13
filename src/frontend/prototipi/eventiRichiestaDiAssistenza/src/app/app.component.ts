import { Component } from '@angular/core';
/*import { Evento } from './evento-richiesta/evento';*/
import { Evento } from './evento-richiesta/evento.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Eventi della Richiesta di assistenza';

  /*
  eventoRichiesta : Evento;

      constructor() { 
        this.eventoRichiesta = { 
          tipo:"telefonata",
          descrizione: "ricevuta alle 10:12 di oggi", 
          HTMLLinkElement: "about:blank" 
        };
      }
  */
    
  private elencoEventiRichiesta : Evento[] = [];
  
        constructor() { 

        }

        ngOnInit() {
          this.elencoEventiRichiesta[0] = { 
            tipo:"telefonata",
            descrizione: "telefonata ricevuta alle 10:12 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[1] = { 
            tipo:"assegnazione_partenza",
            descrizione: "partenza M_45678 assegnata alle 10:15 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[2] = { 
            tipo:"uscita_partenza",
            descrizione: "partenza M_45678 uscita alle 10:18 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[3] = { 
            tipo:"arrivo_partenza_sul_posto",
            descrizione: "partenza M_45678 arrivata sul posto alle 10:30 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[4] = { 
            tipo:"fine_intervento_della_partenza",
            descrizione: "partenza M_45678 in rientro dal posto alle 11:15 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[5] = { 
            tipo:"rientro_in_sede_della_partenza",
            descrizione: "partenza M_45678 rientrata in sede alle 11:45 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
          this.elencoEventiRichiesta[6] = { 
            tipo:"chiusura_richiesta",
            descrizione: "richiesta di assistenza conclusa alle 11:55 di oggi", 
            HTMLLinkElement: "http://about:blank" 
          };
        }
}

