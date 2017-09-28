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
            descrizione: "ricevuta alle 10:12 di oggi", 
            HTMLLinkElement: "about:blank" 
          };
          this.elencoEventiRichiesta[1] = { 
            tipo:"assegnazione Mezzo",
            descrizione: "effettuata alle 10:15 di oggi", 
            HTMLLinkElement: "about:blank" 
          };
        }
}

